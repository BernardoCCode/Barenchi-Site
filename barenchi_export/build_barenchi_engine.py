"""Barenchi Engine — compact vertical precision instrument."""
from __future__ import annotations

import math
from mathutils import Vector, Euler

import bmesh
import bpy

USER_DIR = "/home/beranrdocs/Downloads/Barenchi/Site Barenchi"
BLEND_PATH = f"{USER_DIR}/barenchi_engine_master.blend"
GLB_PATH = f"{USER_DIR}/barenchi_export/barenchi_engine.glb"
PREVIEW_PATH = f"{USER_DIR}/barenchi_export/barenchi_engine_preview.png"


def _sock(node, names, value):
    for name in names:
        if name in node.inputs:
            try:
                node.inputs[name].default_value = value
            except Exception:
                pass
            return


def new_material(name, *, color, metallic=0.0, roughness=0.4, transmission=0.0,
                 emission=(0, 0, 0), emission_strength=0.0, alpha=1.0, ior=1.45):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    _sock(bsdf, ("Base Color",), (*color, 1.0))
    _sock(bsdf, ("Metallic",), metallic)
    _sock(bsdf, ("Roughness",), roughness)
    _sock(bsdf, ("Transmission Weight", "Transmission"), transmission)
    _sock(bsdf, ("IOR",), ior)
    _sock(bsdf, ("Alpha",), alpha)
    _sock(bsdf, ("Emission Color", "Emission"), (*emission, 1.0))
    _sock(bsdf, ("Emission Strength",), emission_strength)
    _sock(bsdf, ("Coat Weight", "Clearcoat"), 0.22 if metallic > 0.5 else 0.0)
    _sock(bsdf, ("Coat Roughness", "Clearcoat Roughness"), 0.26)
    if transmission > 0.2:
        mat.blend_method = "BLEND"
        if hasattr(mat, "surface_render_method"):
            mat.surface_render_method = "BLENDED"
        if hasattr(mat, "use_screen_refraction"):
            mat.use_screen_refraction = True
    return mat


def link(obj, col):
    col.objects.link(obj)
    return obj


def make_empty(name, col, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, size=0.08):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = size
    obj.location = loc
    obj.rotation_euler = rot
    obj.hide_viewport = False
    link(obj, col)
    if parent:
        obj.parent = parent
    return obj


def mesh_from_bm(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    return mesh


def obj_mesh(name, mesh, col, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, mat=None):
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.rotation_euler = rot
    link(obj, col)
    if parent:
        obj.parent = parent
    if mat:
        obj.data.materials.append(mat)
    return obj


def shade_smooth(obj):
    try:
        obj.data.shade_smooth()
    except Exception:
        pass


def bm_bevel(bm, offset=0.003, segs=2):
    if offset <= 0:
        return
    bm.edges.ensure_lookup_table()
    bmesh.ops.bevel(
        bm, geom=list(bm.edges), offset=offset, segments=segs, affect="EDGES", profile=0.7
    )


def cube_mesh(name, sx, sy, sz, bevel=0.003):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def cyl_mesh(name, radius, depth, segs=18, bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=segs,
        radius1=radius, radius2=radius, depth=depth,
    )
    if bevel:
        bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def ico_mesh(name, radius, subdiv, scale=(1, 1, 1)):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=radius)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    return mesh_from_bm(name, bm)


def uv_sphere_mesh(name, radius, segs, rings, scale=(1, 1, 1)):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=radius)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    return mesh_from_bm(name, bm)


def _fill_torus(bm, major, minor, maj_s, min_s, start_deg=0.0, end_deg=360.0):
    a0 = math.radians(start_deg)
    a1 = math.radians(end_deg)
    if a1 <= a0:
        a1 += math.tau
    span = a1 - a0
    closed = abs(span - math.tau) < 1e-4
    rings_n = maj_s if closed else maj_s + 1
    verts = []
    for i in range(rings_n):
        u = a0 + span * (i / maj_s)
        cx, cy = math.cos(u) * major, math.sin(u) * major
        ring = []
        for j in range(min_s):
            v = (j / min_s) * math.tau
            nx = math.cos(u) * math.cos(v)
            ny = math.sin(u) * math.cos(v)
            nz = math.sin(v)
            ring.append(bm.verts.new((cx + nx * minor, cy + ny * minor, nz * minor)))
        verts.append(ring)
    for i in range(maj_s if closed else rings_n - 1):
        i2 = (i + 1) % rings_n if closed else i + 1
        for j in range(min_s):
            j2 = (j + 1) % min_s
            bm.faces.new((verts[i][j], verts[i2][j], verts[i2][j2], verts[i][j2]))
    bm.normal_update()


def torus_mesh(name, major, minor, maj_s, min_s, start_deg=0.0, end_deg=360.0):
    bm = bmesh.new()
    _fill_torus(bm, major, minor, maj_s, min_s, start_deg, end_deg)
    return mesh_from_bm(name, bm)


def look_outward(loc: Vector) -> Euler:
    if loc.length < 1e-6:
        return Euler((0, 0, 0))
    return loc.to_track_quat("X", "Z").to_euler()


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablock in (
        bpy.data.meshes, bpy.data.materials, bpy.data.actions,
        bpy.data.lights, bpy.data.cameras, bpy.data.curves,
    ):
        for item in list(datablock):
            if item.users == 0:
                datablock.remove(item)
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 180
    scene.render.fps = 30
    scene.render.engine = "BLENDER_EEVEE"
    scene.unit_settings.system = "METRIC"
    if hasattr(scene.eevee, "use_raytracing"):
        scene.eevee.use_raytracing = True
    world = bpy.data.worlds.get("BAR_WORLD_PREVIEW") or bpy.data.worlds.new("BAR_WORLD_PREVIEW")
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.93, 0.93, 0.905, 1)
        bg.inputs[1].default_value = 0.62
    scene.world = world


def build_materials():
    return {
        "graphite": new_material("BAR_METAL_GRAPHITE", color=(0.11, 0.11, 0.105), metallic=0.9, roughness=0.44),
        "black": new_material("BAR_METAL_BLACK", color=(0.016, 0.016, 0.015), metallic=0.74, roughness=0.38),
        "alum": new_material("BAR_BRUSHED_ALUMINUM", color=(0.42, 0.415, 0.395), metallic=1.0, roughness=0.34),
        "glass": new_material(
            "BAR_SMOKED_GLASS", color=(0.055, 0.055, 0.05), metallic=0.03,
            roughness=0.07, transmission=0.9, alpha=0.94, ior=1.52,
        ),
        "emit": new_material(
            "BAR_CORE_EMISSION", color=(0.96, 0.91, 0.82), metallic=0.0, roughness=0.32,
            emission=(1.0, 0.93, 0.82), emission_strength=1.8,
        ),
    }


def add_preview_lights(col):
    def area(name, energy, size, loc, rot, color):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.size = size
        data.color = color
        data.shape = "RECTANGLE"
        data.size_y = size * 0.7
        obj = bpy.data.objects.new(name, data)
        obj.location = loc
        obj.rotation_euler = rot
        link(obj, col)
        return obj

    area("BAR_LIGHT_KEY", 520, 5.2, (-2.4, -3.6, 3.4), (math.radians(50), 0, math.radians(-26)), (1, 0.985, 0.95))
    area("BAR_LIGHT_FILL", 110, 6.0, (3.2, -2.0, 1.6), (math.radians(70), 0, math.radians(68)), (0.97, 0.97, 0.96))
    area("BAR_LIGHT_RIM", 190, 2.2, (1.6, 3.0, 2.4), (math.radians(62), 0, math.radians(155)), (1, 0.99, 0.97))


def add_hero_camera(col):
    cam_data = bpy.data.cameras.new("BAR_HERO_CAMERA")
    cam_data.lens = 60
    cam_data.sensor_width = 36
    cam_data.clip_start = 0.05
    cam_data.clip_end = 40
    cam = bpy.data.objects.new("BAR_HERO_CAMERA", cam_data)
    cam.location = (-0.42, -3.55, 0.42)
    link(cam, col)
    target = bpy.data.objects.new("BAR_CAM_TARGET", None)
    target.location = (0.28, 0.0, 0.02)
    link(target, col)
    track = cam.constraints.new("TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"
    bpy.context.scene.camera = cam
    return cam


def build_chassis(root, col, mats):
    """Open-front instrument frame so the optical core is visible and everything bolts on."""
    back = obj_mesh(
        "BAR_CHASSIS_BACK",
        cube_mesh("BAR_CHASSIS_BACK_M", 0.50, 0.10, 1.62, 0.014),
        col, loc=(0.0, 0.18, 0.0), parent=root, mat=mats["graphite"],
    )
    shade_smooth(back)
    left = obj_mesh(
        "BAR_CHASSIS_LEFT",
        cube_mesh("BAR_CHASSIS_LEFT_M", 0.07, 0.30, 1.62, 0.010),
        col, loc=(-0.215, 0.04, 0.0), parent=root, mat=mats["graphite"],
    )
    shade_smooth(left)
    right = obj_mesh(
        "BAR_CHASSIS_RIGHT",
        cube_mesh("BAR_CHASSIS_RIGHT_M", 0.07, 0.30, 1.62, 0.010),
        col, loc=(0.215, 0.04, 0.0), parent=root, mat=mats["graphite"],
    )
    shade_smooth(right)
    top = obj_mesh(
        "BAR_CHASSIS_TOP",
        cube_mesh("BAR_CHASSIS_TOP_M", 0.50, 0.30, 0.08, 0.010),
        col, loc=(0.0, 0.04, 0.81), parent=root, mat=mats["alum"],
    )
    shade_smooth(top)
    bottom = obj_mesh(
        "BAR_CHASSIS_BOTTOM",
        cube_mesh("BAR_CHASSIS_BOTTOM_M", 0.50, 0.32, 0.09, 0.010),
        col, loc=(0.0, 0.03, -0.81), parent=root, mat=mats["graphite"],
    )
    shade_smooth(bottom)
    # Front window frame — four sides, opening stays empty for the glass.
    frame_specs = (
        ("BAR_CHASSIS_FRAME_T", (0.32, 0.03, 0.03), (0.0, -0.12, 0.58)),
        ("BAR_CHASSIS_FRAME_B", (0.32, 0.03, 0.03), (0.0, -0.12, -0.50)),
        ("BAR_CHASSIS_FRAME_L", (0.03, 0.03, 1.08), (-0.155, -0.12, 0.04)),
        ("BAR_CHASSIS_FRAME_R", (0.03, 0.03, 1.08), (0.155, -0.12, 0.04)),
    )
    for name, size, loc in frame_specs:
        fr = obj_mesh(name, cube_mesh(f"{name}_M", *size, 0.004), col, loc=loc, parent=root, mat=mats["black"])
        shade_smooth(fr)
    rail_l = obj_mesh(
        "BAR_CHASSIS_RAIL_L",
        cube_mesh("BAR_CHASSIS_RAIL_L_M", 0.03, 0.05, 1.28, 0.003),
        col, loc=(-0.255, -0.02, 0.0), parent=root, mat=mats["alum"],
    )
    shade_smooth(rail_l)
    rail_r = obj_mesh(
        "BAR_CHASSIS_RAIL_R",
        cube_mesh("BAR_CHASSIS_RAIL_R_M", 0.03, 0.05, 1.28, 0.003),
        col, loc=(0.255, -0.02, 0.0), parent=root, mat=mats["alum"],
    )
    shade_smooth(rail_r)
    base = obj_mesh(
        "BAR_CHASSIS_BASE",
        cube_mesh("BAR_CHASSIS_BASE_M", 0.58, 0.40, 0.07, 0.01),
        col, loc=(0.02, 0.02, -0.90), parent=root, mat=mats["graphite"],
    )
    shade_smooth(base)
    return back


def build_core(root, col, mats):
    """Optical chamber seated inside the housing aperture — not a floating orb."""
    core = make_empty("BAR_CORE", col, loc=(0.0, -0.01, 0.05), parent=root, size=0.12)
    shell = obj_mesh(
        "BAR_CORE_SHELL",
        ico_mesh("BAR_CORE_SHELL_MESH", 0.20, 2, (0.70, 0.58, 2.05)),
        col, parent=core, mat=mats["glass"],
    )
    shade_smooth(shell)
    layer = obj_mesh(
        "BAR_CORE_LAYER",
        ico_mesh("BAR_CORE_LAYER_MESH", 0.13, 2, (0.74, 0.48, 1.65)),
        col, parent=core, mat=mats["glass"],
    )
    shade_smooth(layer)
    lamp = obj_mesh(
        "BAR_CORE_LAMP",
        uv_sphere_mesh("BAR_CORE_LAMP_MESH", 0.042, 16, 10, (0.7, 0.7, 1.8)),
        col, parent=core, mat=mats["emit"],
    )
    shade_smooth(lamp)
    for i, z in enumerate((-0.28, 0.0, 0.28)):
        band = obj_mesh(
            f"BAR_CORE_BAND_{i:02d}",
            torus_mesh(f"BAR_CORE_BAND_M_{i}", 0.12 if i == 1 else 0.105, 0.008, 28, 8),
            col, loc=(0, 0, z), rot=(math.radians(90), 0, 0), parent=core, mat=mats["alum"],
        )
        shade_smooth(band)
    return core


def ring_rig(name, col, parent, mats, major, minor, tilt, roll, yaw, arc, studs, mat_key):
    empty = make_empty(name, col, rot=(tilt, roll, yaw), parent=parent, size=0.12)
    body = obj_mesh(
        f"{name}_BODY",
        torus_mesh(f"{name}_M", major, minor, 64, 10, arc[0], arc[1]),
        col, parent=empty, mat=mats[mat_key],
    )
    shade_smooth(body)
    for i in range(studs):
        t = math.radians(arc[0] + (arc[1] - arc[0]) * ((i + 0.5) / studs))
        stud = obj_mesh(
            f"{name}_STUD_{i:02d}",
            cyl_mesh(f"{name}_STUD_M_{i}", minor * 0.85, minor * 2.6, 10, 0.001),
            col, loc=(math.cos(t) * major, math.sin(t) * major, 0),
            rot=(math.radians(90), 0, t), parent=empty, mat=mats["black"],
        )
        shade_smooth(stud)
    return empty


def build_rings(root, col, mats):
    r1 = ring_rig(
        "BAR_RING_PRIMARY", col, root, mats,
        major=0.38, minor=0.018, tilt=math.radians(10), roll=math.radians(3),
        yaw=math.radians(8), arc=(118, 338), studs=4, mat_key="alum",
    )
    lock = obj_mesh(
        "BAR_RING_PRIMARY_LOCK_00",
        cube_mesh("BAR_RING_PRIMARY_LOCK_M", 0.042, 0.03, 0.022, 0.003),
        col, loc=(0.38, 0.04, 0), parent=r1, mat=mats["black"],
    )
    shade_smooth(lock)
    r2 = ring_rig(
        "BAR_RING_SECONDARY", col, root, mats,
        major=0.34, minor=0.010, tilt=math.radians(-26), roll=math.radians(6),
        yaw=math.radians(28), arc=(30, 310), studs=3, mat_key="graphite",
    )
    r3 = ring_rig(
        "BAR_RING_TERTIARY", col, root, mats,
        major=0.46, minor=0.008, tilt=math.radians(42), roll=math.radians(-3),
        yaw=math.radians(-12), arc=(55, 230), studs=2, mat_key="black",
    )
    # Mechanical mounts so rings read as attached gimbals, not free orbits
    for i, (loc, rot) in enumerate((
        ((0.22, 0.12, 0.06), (0, math.radians(90), 0)),
        ((-0.22, 0.12, -0.04), (0, math.radians(90), 0)),
    )):
        br = obj_mesh(
            f"BAR_RING_MOUNT_{i:02d}",
            cube_mesh(f"BAR_RING_MOUNT_M_{i}", 0.08, 0.03, 0.04, 0.003),
            col, loc=loc, rot=rot, parent=root, mat=mats["alum"],
        )
        shade_smooth(br)
    return r1, r2, r3


def module_landing(empty, col, mats):
    plate = obj_mesh(
        "BAR_LANDING_PLATE",
        cube_mesh("BAR_LANDING_PLATE_M", 0.09, 0.38, 0.28, 0.008),
        col, loc=(0.05, 0, 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(plate)
    dock = obj_mesh(
        "BAR_LANDING_DOCK",
        cube_mesh("BAR_LANDING_DOCK_M", 0.03, 0.22, 0.16, 0.003),
        col, loc=(0.155, 0, 0.02), parent=empty, mat=mats["black"],
    )
    shade_smooth(dock)
    for i, y in enumerate((-0.13, 0.13)):
        rail = obj_mesh(
            f"BAR_LANDING_RAIL_{i:02d}",
            cube_mesh(f"BAR_LANDING_RAIL_M_{i}", 0.20, 0.02, 0.03, 0.002),
            col, loc=(0.08, y, -0.10), parent=empty, mat=mats["graphite"],
        )
        shade_smooth(rail)
    pad = obj_mesh(
        "BAR_LANDING_PAD",
        cyl_mesh("BAR_LANDING_PAD_M", 0.06, 0.018, 18, 0.002),
        col, loc=(0.16, 0, 0.02), rot=(0, math.radians(90), 0), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(pad)
    for i, (y, z) in enumerate(((-0.14, 0.09), (0.14, 0.09), (-0.14, -0.08), (0.14, -0.08))):
        pin = obj_mesh(
            f"BAR_LANDING_PIN_{i:02d}",
            cyl_mesh(f"BAR_LANDING_PIN_M_{i}", 0.008, 0.036, 8, 0.001),
            col, loc=(0.17, y, z), rot=(0, math.radians(90), 0), parent=empty, mat=mats["black"],
        )
        shade_smooth(pin)


def module_systems(empty, col, mats):
    for i, w in enumerate((0.30, 0.26, 0.22, 0.18, 0.14)):
        slab = obj_mesh(
            f"BAR_SYSTEMS_SLAB_{i:02d}",
            cube_mesh(f"BAR_SYSTEMS_SLAB_M_{i}", 0.026, w, 0.18, 0.0025),
            col, loc=(0.04 + i * 0.024, 0.006 * (i - 2), 0.005 * (2 - i)),
            parent=empty, mat=mats["alum"] if i % 2 == 0 else mats["graphite"],
        )
        shade_smooth(slab)
    spine = obj_mesh(
        "BAR_SYSTEMS_SPINE",
        cube_mesh("BAR_SYSTEMS_SPINE_M", 0.18, 0.028, 0.05, 0.002),
        col, loc=(0.12, -0.13, 0), parent=empty, mat=mats["black"],
    )
    shade_smooth(spine)
    for i in range(3):
        slot = obj_mesh(
            f"BAR_SYSTEMS_SLOT_{i:02d}",
            cube_mesh(f"BAR_SYSTEMS_SLOT_M_{i}", 0.01, 0.09, 0.012, 0.001),
            col, loc=(0.175, 0.02, -0.05 + i * 0.045), parent=empty, mat=mats["black"],
        )
        shade_smooth(slot)


def module_automation(empty, col, mats):
    house = obj_mesh(
        "BAR_AUTO_HOUSE",
        cyl_mesh("BAR_AUTO_HOUSE_M", 0.078, 0.24, 22, 0.004),
        col, loc=(0.08, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(house)
    piston = obj_mesh(
        "BAR_AUTO_PISTON",
        cyl_mesh("BAR_AUTO_PISTON_M", 0.028, 0.14, 14, 0.002),
        col, loc=(0.28, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(piston)
    cap = obj_mesh(
        "BAR_AUTO_CAP",
        cyl_mesh("BAR_AUTO_CAP_M", 0.036, 0.02, 14, 0.002),
        col, loc=(0.36, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["black"],
    )
    shade_smooth(cap)
    collar = obj_mesh(
        "BAR_AUTO_COLLAR",
        cyl_mesh("BAR_AUTO_COLLAR_M", 0.09, 0.032, 22, 0.003),
        col, loc=(0.05, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(collar)
    guide = obj_mesh(
        "BAR_AUTO_GUIDE",
        cube_mesh("BAR_AUTO_GUIDE_M", 0.18, 0.022, 0.034, 0.002),
        col, loc=(0.16, 0.075, 0), parent=empty, mat=mats["black"],
    )
    shade_smooth(guide)
    head = obj_mesh(
        "BAR_AUTO_HEAD",
        cube_mesh("BAR_AUTO_HEAD_M", 0.038, 0.048, 0.048, 0.003),
        col, loc=(0.39, 0, 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(head)


def module_integrations(empty, col, mats):
    hub = obj_mesh(
        "BAR_INT_HUB",
        cyl_mesh("BAR_INT_HUB_M", 0.095, 0.11, 6, 0.005),
        col, loc=(0.07, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(hub)
    face = obj_mesh(
        "BAR_INT_FACE",
        cyl_mesh("BAR_INT_FACE_M", 0.08, 0.02, 6, 0.002),
        col, loc=(0.185, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(face)
    for i, ang in enumerate((0.15, 2.2, 4.3)):
        port = obj_mesh(
            f"BAR_INT_PORT_{i:02d}",
            cyl_mesh(f"BAR_INT_PORT_M_{i}", 0.022, 0.068, 12, 0.002),
            col, loc=(0.12, math.cos(ang) * 0.10, math.sin(ang) * 0.10),
            rot=(math.sin(ang) * 1.15, math.radians(90), 0), parent=empty, mat=mats["black"],
        )
        shade_smooth(port)
        lip = obj_mesh(
            f"BAR_INT_LIP_{i:02d}",
            cyl_mesh(f"BAR_INT_LIP_M_{i}", 0.028, 0.014, 12, 0.0015),
            col, loc=(0.12, math.cos(ang) * 0.132, math.sin(ang) * 0.132),
            rot=(math.sin(ang) * 1.15, math.radians(90), 0), parent=empty, mat=mats["alum"],
        )
        shade_smooth(lip)


def module_design(empty, col, mats):
    body = obj_mesh(
        "BAR_DESIGN_BODY",
        cube_mesh("BAR_DESIGN_BODY_M", 0.05, 0.32, 0.22, 0.01),
        col, loc=(0.04, 0.01, 0.0), rot=(0, 0, math.radians(8)), parent=empty, mat=mats["alum"],
    )
    shade_smooth(body)
    inset = obj_mesh(
        "BAR_DESIGN_INSET",
        cube_mesh("BAR_DESIGN_INSET_M", 0.012, 0.22, 0.12, 0.002),
        col, loc=(0.13, 0.03, 0.015), rot=(0, 0, math.radians(16)), parent=empty, mat=mats["black"],
    )
    shade_smooth(inset)
    for i in range(4):
        groove = obj_mesh(
            f"BAR_DESIGN_GROOVE_{i:02d}",
            cube_mesh(f"BAR_DESIGN_GROOVE_M_{i}", 0.006, 0.18, 0.006, 0.001),
            col, loc=(0.128, 0.01, -0.06 + i * 0.04), rot=(0, 0, math.radians(16)),
            parent=empty, mat=mats["graphite"],
        )
        shade_smooth(groove)
    mark = obj_mesh(
        "BAR_DESIGN_MARK",
        cube_mesh("BAR_DESIGN_MARK_M", 0.004, 0.016, 0.016, 0.0008),
        col, loc=(0.134, -0.10, -0.07), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(mark)


def module_architecture(empty, col, mats):
    vert = obj_mesh(
        "BAR_ARCH_VERT",
        cube_mesh("BAR_ARCH_VERT_M", 0.038, 0.18, 0.30, 0.005),
        col, loc=(0.08, 0.05, 0.04), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(vert)
    horiz = obj_mesh(
        "BAR_ARCH_HORIZ",
        cube_mesh("BAR_ARCH_HORIZ_M", 0.038, 0.26, 0.08, 0.005),
        col, loc=(0.08, -0.05, -0.10), parent=empty, mat=mats["graphite"],
    )
    shade_smooth(horiz)
    brace = obj_mesh(
        "BAR_ARCH_BRACE",
        cube_mesh("BAR_ARCH_BRACE_M", 0.018, 0.20, 0.028, 0.002),
        col, loc=(0.08, 0.0, 0.05), rot=(math.radians(36), 0, 0), parent=empty, mat=mats["alum"],
    )
    shade_smooth(brace)
    for i, z in enumerate((-0.02, 0.08, 0.16)):
        void = obj_mesh(
            f"BAR_ARCH_VOID_{i:02d}",
            cube_mesh(f"BAR_ARCH_VOID_M_{i}", 0.02, 0.048, 0.028, 0.001),
            col, loc=(0.102, 0.05, z), parent=empty, mat=mats["black"],
        )
        shade_smooth(void)


BUILDERS = {
    "BAR_MODULE_LANDING": module_landing,
    "BAR_MODULE_SYSTEMS": module_systems,
    "BAR_MODULE_AUTOMATION": module_automation,
    "BAR_MODULE_INTEGRATIONS": module_integrations,
    "BAR_MODULE_DESIGN": module_design,
    "BAR_MODULE_ARCHITECTURE": module_architecture,
}

# Tight constellation — modules clamp onto the chassis, not orbit in space.
MODULE_LOCS = {
    "BAR_MODULE_LANDING": Vector((0.00, -0.20, -0.78)),
    "BAR_MODULE_SYSTEMS": Vector((0.26, 0.02, 0.08)),
    "BAR_MODULE_AUTOMATION": Vector((-0.26, 0.04, 0.08)),
    "BAR_MODULE_INTEGRATIONS": Vector((0.24, -0.06, 0.42)),
    "BAR_MODULE_DESIGN": Vector((0.00, 0.02, 0.86)),
    "BAR_MODULE_ARCHITECTURE": Vector((0.16, 0.14, -0.90)),
}


def build_modules(root, col, mats):
    modules = {}
    for name, loc in MODULE_LOCS.items():
        empty = make_empty(name, col, loc=loc, rot=look_outward(loc), parent=root, size=0.1)
        iface = obj_mesh(
            f"{name}_IFACE",
            cyl_mesh(f"{name}_IFACE_M", 0.042, 0.046, 16, 0.002),
            col, loc=(-0.01, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
        )
        shade_smooth(iface)
        recess = obj_mesh(
            f"{name}_RECESS",
            cyl_mesh(f"{name}_RECESS_M", 0.024, 0.012, 12, 0.001),
            col, loc=(-0.03, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["black"],
        )
        shade_smooth(recess)
        BUILDERS[name](empty, col, mats)
        modules[name] = empty
    return modules


def build_connectors(root, col, mats, modules):
    connectors = []
    core_pt = Vector((0.04, -0.04, 0.02))
    for i, (name, mod) in enumerate(modules.items(), start=1):
        b = Vector(mod.location)
        d = (b - core_pt)
        direction = d.normalized()
        start = b - direction * 0.10
        end = b - direction * 0.03
        mid = (start + end) * 0.5
        length = max((end - start).length, 0.08)
        rot = direction.to_track_quat("Z", "X").to_euler()
        empty = make_empty(f"BAR_CONNECTOR_{i:02d}", col, loc=mid, rot=rot, parent=root, size=0.05)
        rod = obj_mesh(
            f"BAR_CONNECTOR_{i:02d}_ROD",
            cyl_mesh(f"BAR_CONN_ROD_M_{i}", 0.0085, length, 10, 0.001),
            col, parent=empty, mat=mats["graphite"],
        )
        shade_smooth(rod)
        for suffix, z in (("A", -length * 0.5), ("B", length * 0.5)):
            joint = obj_mesh(
                f"BAR_CONNECTOR_{i:02d}_JOINT_{suffix}",
                cyl_mesh(f"BAR_CONN_J{suffix}_M_{i}", 0.015, 0.018, 10, 0.002),
                col, loc=(0, 0, z), parent=empty, mat=mats["alum"],
            )
            shade_smooth(joint)
        connectors.append(empty)

    return connectors


def set_preview_view():
    for area in bpy.context.screen.areas:
        if area.type != "VIEW_3D":
            continue
        for space in area.spaces:
            if space.type != "VIEW_3D":
                continue
            space.region_3d.view_perspective = "CAMERA"
            space.overlay.show_overlays = False
            space.shading.type = "RENDERED"
            space.shading.use_scene_lights = True
            space.shading.use_scene_world = True


def pose_snapshot(objects):
    return {o.name: (o.location.copy(), o.rotation_euler.copy(), o.scale.copy()) for o in objects}


def apply_pose(obj, loc=None, rot=None, scale=None):
    if loc is not None:
        obj.location = loc
    if rot is not None:
        obj.rotation_euler = rot
    if scale is not None:
        obj.scale = scale


def key_trs(obj, frame):
    obj.keyframe_insert("location", frame=frame)
    obj.keyframe_insert("rotation_euler", frame=frame)
    obj.keyframe_insert("scale", frame=frame)


def iter_fcurves(action):
    if hasattr(action, "fcurves"):
        try:
            for fc in action.fcurves:
                yield fc
            return
        except Exception:
            pass
    for layer in getattr(action, "layers", []):
        for strip in layer.strips:
            for bag in getattr(strip, "channelbags", []):
                for fc in bag.fcurves:
                    yield fc


def polish_action(action, linear=False):
    for fc in iter_fcurves(action):
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR" if linear else "BEZIER"
            if not linear:
                kp.handle_left_type = "AUTO_CLAMPED"
                kp.handle_right_type = "AUTO_CLAMPED"


def push_nla(obj, track_name):
    ad = obj.animation_data
    act = ad.action
    act.name = f"{track_name}__{obj.name}"
    track = ad.nla_tracks.new()
    track.name = track_name
    track.strips.new(track_name, int(act.frame_range[0]), act)
    ad.action = None


def begin_clip(objects, clip):
    for obj in objects:
        obj.animation_data_create()
        obj.animation_data.action = bpy.data.actions.new(f"{clip}__{obj.name}")


def end_clip(objects, clip, linear=False):
    for obj in objects:
        if obj.animation_data and obj.animation_data.action:
            polish_action(obj.animation_data.action, linear=linear)
            push_nla(obj, clip)


def build_animations(core, rings, modules):
    animated = [core, *rings, *modules.values()]
    rest = pose_snapshot(animated)
    cam_dir = Vector((0.0, -1.0, 0.0))

    def restore():
        for obj in animated:
            apply_pose(obj, *rest[obj.name])

    restore()
    begin_clip(animated, "IDLE")
    for obj in animated:
        key_trs(obj, 1)
    core.rotation_euler.z = rest[core.name][1].z + math.radians(6)
    key_trs(core, 180)
    for ring, deg in zip(rings, (18, -14, 11)):
        ring.rotation_euler.z = rest[ring.name][1].z + math.radians(deg)
        key_trs(ring, 180)
    for i, obj in enumerate(modules.values()):
        loc, rot, sc = rest[obj.name]
        out = Vector(loc).normalized()
        apply_pose(obj, loc + out * 0.01 * ((-1) ** i), Euler((rot.x, rot.y, rot.z + math.radians(1.2))), sc)
        key_trs(obj, 90)
        apply_pose(obj, loc, rot, sc)
        key_trs(obj, 180)
    end_clip(animated, "IDLE", linear=True)

    restore()
    begin_clip(animated, "ASSEMBLE")
    apply_pose(core, rest[core.name][0], rest[core.name][1], Vector((0.86, 0.86, 0.86)))
    key_trs(core, 1)
    apply_pose(core, *rest[core.name])
    key_trs(core, 90)
    for ring in rings:
        loc, rot, _ = rest[ring.name]
        apply_pose(ring, loc, Euler((rot.x, rot.y, rot.z + 0.12)), Vector((1.12, 1.12, 1.12)))
        key_trs(ring, 1)
        apply_pose(ring, *rest[ring.name])
        key_trs(ring, 90)
    for obj in modules.values():
        loc, rot, sc = rest[obj.name]
        apply_pose(obj, loc * 1.22, rot, sc)
        key_trs(obj, 1)
        apply_pose(obj, loc, rot, sc)
        key_trs(obj, 90)
    end_clip(animated, "ASSEMBLE")

    focus_map = {
        "LANDING_FOCUS": "BAR_MODULE_LANDING",
        "SYSTEMS_FOCUS": "BAR_MODULE_SYSTEMS",
        "AUTOMATION_FOCUS": "BAR_MODULE_AUTOMATION",
        "INTEGRATIONS_FOCUS": "BAR_MODULE_INTEGRATIONS",
        "DESIGN_FOCUS": "BAR_MODULE_DESIGN",
        "ARCHITECTURE_FOCUS": "BAR_MODULE_ARCHITECTURE",
    }
    for clip, target_name in focus_map.items():
        restore()
        begin_clip(animated, clip)
        for obj in animated:
            key_trs(obj, 1)
        target = modules[target_name]
        loc, rot, sc = rest[target.name]
        out = Vector(loc).normalized()
        apply_pose(
            target,
            loc + out * 0.08 + cam_dir * 0.05 + Vector((0, 0, 0.02)),
            Euler((rot.x + math.radians(5), rot.y, rot.z + math.radians(6))),
            sc,
        )
        key_trs(target, 60)
        for name, obj in modules.items():
            if name == target_name:
                continue
            l, r, s = rest[obj.name]
            apply_pose(obj, l * 0.97, r, s)
            key_trs(obj, 60)
        cr = rest[core.name][1]
        apply_pose(core, rest[core.name][0], Euler((cr.x, cr.y, cr.z + math.radians(3))), rest[core.name][2])
        key_trs(core, 60)
        end_clip(animated, clip)

    restore()
    begin_clip(animated, "RESET")
    for obj in modules.values():
        loc, rot, sc = rest[obj.name]
        apply_pose(obj, loc + Vector(loc).normalized() * 0.06, Euler((rot.x, rot.y, rot.z + math.radians(4))), sc)
        key_trs(obj, 1)
        apply_pose(obj, loc, rot, sc)
        key_trs(obj, 45)
    for ring in rings:
        loc, rot, sc = rest[ring.name]
        apply_pose(ring, loc, Euler((rot.x, rot.y, rot.z + math.radians(6))), sc)
        key_trs(ring, 1)
        apply_pose(ring, loc, rot, sc)
        key_trs(ring, 45)
    cr = rest[core.name][1]
    apply_pose(core, rest[core.name][0], Euler((cr.x, cr.y, cr.z + math.radians(4))), rest[core.name][2])
    key_trs(core, 1)
    apply_pose(core, *rest[core.name])
    key_trs(core, 45)
    end_clip(animated, "RESET")
    restore()
    bpy.context.scene.frame_set(1)


def count_tris():
    total = 0
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        if obj.name.startswith("BAR_LIGHT") or obj.name.startswith("BAR_HERO"):
            continue
        obj.data.calc_loop_triangles()
        total += len(obj.data.loop_triangles)
    return total


def select_export(root):
    bpy.ops.object.select_all(action="DESELECT")

    def walk(o):
        if o.type in {"EMPTY", "MESH"}:
            o.select_set(True)
        for c in o.children:
            walk(c)

    walk(root)
    bpy.context.view_layer.objects.active = root


def export_glb(root):
    select_export(root)
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_animations=True,
        export_animation_mode="NLA_TRACKS",
        export_merge_animation="NLA_TRACK",
        export_nla_strips=True,
        export_cameras=False,
        export_extras=False,
        export_yup=True,
    )


def save_blend():
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)


def render_preview():
    scene = bpy.context.scene
    scene.render.filepath = PREVIEW_PATH
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 1600
    scene.render.film_transparent = False
    bpy.ops.render.render(write_still=True)


def build():
    reset_scene()
    engine_col = bpy.data.collections.new("BARENCHI_ENGINE")
    preview_col = bpy.data.collections.new("BARENCHI_PREVIEW")
    bpy.context.scene.collection.children.link(engine_col)
    bpy.context.scene.collection.children.link(preview_col)
    mats = build_materials()
    root = make_empty("BARENCHI_ENGINE_ROOT", engine_col, size=0.2)
    build_chassis(root, engine_col, mats)
    core = build_core(root, engine_col, mats)
    rings = build_rings(root, engine_col, mats)
    modules = build_modules(root, engine_col, mats)
    build_connectors(root, engine_col, mats, modules)
    add_preview_lights(preview_col)
    add_hero_camera(preview_col)
    build_animations(core, rings, modules)
    set_preview_view()
    tris = count_tris()
    save_blend()
    export_glb(root)
    render_preview()
    save_blend()
    tracks = sorted({t.name for o in bpy.data.objects if o.animation_data for t in o.animation_data.nla_tracks})
    required = [
        "BARENCHI_ENGINE_ROOT", "BAR_CORE",
        "BAR_RING_PRIMARY", "BAR_RING_SECONDARY", "BAR_RING_TERTIARY",
        *MODULE_LOCS.keys(),
    ]
    missing = [n for n in required if n not in bpy.data.objects]
    return {"tris": tris, "nla": tracks, "missing": missing, "objects": len(engine_col.objects)}


RESULT = build()
print("BUILD_OK", RESULT)
