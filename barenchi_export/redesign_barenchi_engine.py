"""Redesign the existing Barenchi Engine: open architecture, no cabinet, no GLB."""
from __future__ import annotations

import math
from mathutils import Vector, Euler

import bmesh
import bpy

BLEND_PATH = "/home/beranrdocs/Downloads/Barenchi/Site Barenchi/barenchi_engine_master.blend"
PREVIEW_DIR = "/home/beranrdocs/Downloads/Barenchi/Site Barenchi/barenchi_export"


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
    old = bpy.data.materials.get(name)
    if old:
        bpy.data.materials.remove(old)
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
    _sock(bsdf, ("Coat Weight", "Clearcoat"), 0.16 if metallic > 0.6 else 0.0)
    _sock(bsdf, ("Coat Roughness", "Clearcoat Roughness"), 0.32)
    if transmission > 0.2:
        mat.blend_method = "BLEND"
        if hasattr(mat, "surface_render_method"):
            mat.surface_render_method = "BLENDED"
    return mat


def link(obj, col):
    if obj.name not in col.objects:
        col.objects.link(obj)
    return obj


def make_empty(name, col, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, size=0.08):
    obj = bpy.data.objects.get(name)
    if obj is None:
        obj = bpy.data.objects.new(name, None)
        link(obj, col)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = size
    obj.location = loc
    obj.rotation_euler = rot
    obj.parent = parent
    obj.animation_data_clear()
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
    try:
        obj.data.shade_smooth()
    except Exception:
        pass
    return obj


def bm_bevel(bm, offset=0.003, segs=2):
    if offset <= 0:
        return
    bm.edges.ensure_lookup_table()
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=offset, segments=segs, affect="EDGES", profile=0.7)


def cube_mesh(name, sx, sy, sz, bevel=0.004):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
    bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def cyl_mesh(name, radius, depth, segs=16, bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=segs,
        radius1=radius, radius2=radius, depth=depth,
    )
    if bevel:
        bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def taper_mesh(name, r1, r2, depth, segs=12, bevel=0.003):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, segments=segs, radius1=r1, radius2=r2, depth=depth
    )
    if bevel:
        bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def ico_mesh(name, radius, subdiv, scale=(1, 1, 1), bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=radius)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    if bevel:
        bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def uv_mesh(name, radius, segs, rings, scale=(1, 1, 1), bevel=0.0):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=radius)
    bmesh.ops.scale(bm, vec=scale, verts=bm.verts)
    if bevel:
        bm_bevel(bm, bevel, 2)
    return mesh_from_bm(name, bm)


def fill_torus(bm, major, minor, maj_s, min_s, start_deg, end_deg):
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
    fill_torus(bm, major, minor, maj_s, min_s, start_deg, end_deg)
    return mesh_from_bm(name, bm)


def look_out(loc: Vector) -> Euler:
    if loc.length < 1e-6:
        return Euler((0, 0, 0))
    return loc.to_track_quat("X", "Z").to_euler()


def delete_object(obj):
    for child in list(obj.children):
        delete_object(child)
    mesh = obj.data if obj.type == "MESH" else None
    bpy.data.objects.remove(obj, do_unlink=True)
    if mesh and mesh.users == 0:
        bpy.data.meshes.remove(mesh)


def purge_unused():
    keep = {"BARENCHI_ENGINE", "BARENCHI_PREVIEW", "Collection"}
    for coll in list(bpy.data.collections):
        if coll.name not in keep and len(coll.objects) == 0:
            bpy.data.collections.remove(coll)
    for block in (bpy.data.meshes, bpy.data.actions):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def clear_engine_geometry(root):
    for child in list(root.children):
        delete_object(child)
    for name in list(bpy.data.objects.keys()):
        if name.startswith("BAR_CHASSIS") or name.startswith("BAR_RING_MOUNT"):
            delete_object(bpy.data.objects[name])


def materials():
    return {
        "graphite": new_material("BAR_METAL_GRAPHITE", color=(0.10, 0.10, 0.096), metallic=0.88, roughness=0.46),
        "black": new_material("BAR_METAL_BLACK", color=(0.015, 0.015, 0.014), metallic=0.7, roughness=0.4),
        "alum": new_material("BAR_METAL_ALUMINUM", color=(0.46, 0.455, 0.435), metallic=1.0, roughness=0.33),
        "glass": new_material(
            "BAR_SMOKED_GLASS", color=(0.09, 0.09, 0.085), metallic=0.02,
            roughness=0.08, transmission=0.86, alpha=0.9, ior=1.5,
        ),
        "emit": new_material(
            "BAR_CORE_EMISSION", color=(0.96, 0.92, 0.84), metallic=0.0, roughness=0.3,
            emission=(1.0, 0.93, 0.82), emission_strength=1.35,
        ),
    }


def build_core(root, col, mats):
    core = make_empty("BAR_CORE", col, loc=(0.035, -0.02, 0.04), parent=root, size=0.14)
    # Architectural optical cell: faceted elongated hull, not a sphere.
    obj_mesh(
        "BAR_CORE_SHELL",
        uv_mesh("BAR_CORE_SHELL_M", 0.28, 8, 9, (0.92, 0.78, 1.88), bevel=0.012),
        col, parent=core, mat=mats["glass"],
    )
    obj_mesh(
        "BAR_CORE_LAYER",
        uv_mesh("BAR_CORE_LAYER_M", 0.18, 8, 8, (0.86, 0.72, 1.45), bevel=0.006),
        col, parent=core, mat=mats["glass"],
    )
    obj_mesh(
        "BAR_CORE_BARREL",
        cyl_mesh("BAR_CORE_BARREL_M", 0.195, 0.42, 8, 0.006),
        col, parent=core, mat=mats["glass"],
    )
    obj_mesh(
        "BAR_CORE_SPINE",
        cyl_mesh("BAR_CORE_SPINE_M", 0.012, 0.92, 10, 0.002),
        col, parent=core, mat=mats["alum"],
    )
    for i, z in enumerate((-0.16, 0.14)):
        obj_mesh(
            f"BAR_CORE_PLATE_{i:02d}",
            cyl_mesh(f"BAR_CORE_PLATE_M_{i}", 0.145 if i == 0 else 0.125, 0.012, 16, 0.002),
            col, loc=(0, 0, z), parent=core, mat=mats["graphite"],
        )
    obj_mesh(
        "BAR_CORE_LAMP",
        uv_mesh("BAR_CORE_LAMP_M", 0.038, 12, 8, (0.75, 0.75, 1.4)),
        col, parent=core, mat=mats["emit"],
    )
    for i, z in enumerate((-0.34, 0.0, 0.34)):
        obj_mesh(
            f"BAR_CORE_BAND_{i:02d}",
            torus_mesh(f"BAR_CORE_BAND_M_{i}", 0.168 if i == 1 else 0.148, 0.007, 28, 8),
            col, loc=(0, 0, z), rot=(math.radians(90), 0, 0), parent=core, mat=mats["alum"],
        )
    # Tiny internal rods
    for i, ang in enumerate((0.4, 2.2, 3.9)):
        obj_mesh(
            f"BAR_CORE_STRUT_{i:02d}",
            cyl_mesh(f"BAR_CORE_STRUT_M_{i}", 0.004, 0.42, 8),
            col, loc=(math.cos(ang) * 0.07, math.sin(ang) * 0.055, 0.02),
            rot=(0, 0, ang), parent=core, mat=mats["black"],
        )
    return core


def ring_group(name, col, root, mats, major, minor, tilt, roll, yaw, arc, mat_key, joints=True):
    empty = make_empty(name, col, rot=(tilt, roll, yaw), parent=root, size=0.1)
    obj_mesh(
        f"{name}_BODY",
        torus_mesh(f"{name}_M", major, minor, 72, 10, arc[0], arc[1]),
        col, parent=empty, mat=mats[mat_key],
    )
    if joints:
        for tag, deg in (("A", arc[0]), ("B", arc[1])):
            t = math.radians(deg)
            obj_mesh(
                f"{name}_JOINT_{tag}",
                cyl_mesh(f"{name}_J{tag}_M", minor * 2.1, minor * 3.4, 12, 0.002),
                col,
                loc=(math.cos(t) * major, math.sin(t) * major, 0),
                rot=(math.radians(90), 0, t),
                parent=empty,
                mat=mats["black"],
            )
            obj_mesh(
                f"{name}_COLLAR_{tag}",
                cyl_mesh(f"{name}_C{tag}_M", minor * 1.45, minor * 1.6, 12, 0.0015),
                col,
                loc=(math.cos(t) * major, math.sin(t) * major, 0),
                rot=(0, 0, t),
                parent=empty,
                mat=mats["alum"],
            )
    return empty


def build_rings(root, col, mats):
    r1 = ring_group(
        "BAR_RING_PRIMARY", col, root, mats,
        major=0.56, minor=0.016, tilt=math.radians(18), roll=math.radians(5),
        yaw=math.radians(14), arc=(52, 268), mat_key="alum",
    )
    r2 = ring_group(
        "BAR_RING_SECONDARY", col, root, mats,
        major=0.44, minor=0.009, tilt=math.radians(-34), roll=math.radians(8),
        yaw=math.radians(48), arc=(18, 248), mat_key="graphite",
    )
    r3 = ring_group(
        "BAR_RING_TERTIARY", col, root, mats,
        major=0.74, minor=0.0075, tilt=math.radians(52), roll=math.radians(-6),
        yaw=math.radians(-20), arc=(62, 198), mat_key="black",
    )
    return r1, r2, r3


def build_structure(root, col, mats):
    """Open architecture grown around the core — no cabinet."""
    # Primary C-yoke behind/left of the core
    obj_mesh(
        "BAR_ARM_YOKE",
        torus_mesh("BAR_ARM_YOKE_M", 0.40, 0.024, 52, 12, 100, 275),
        col, loc=(0.02, 0.10, 0.02), rot=(math.radians(80), math.radians(6), math.radians(-16)),
        parent=root, mat=mats["graphite"],
    )
    obj_mesh(
        "BAR_ARM_YOKE_JOINT",
        cyl_mesh("BAR_ARM_YOKE_JOINT_M", 0.028, 0.04, 12, 0.003),
        col, loc=(-0.02, 0.26, 0.18), rot=(math.radians(90), 0, 0), parent=root, mat=mats["alum"],
    )
    # Forward-right complementary arc
    obj_mesh(
        "BAR_ARM_SWEEP",
        torus_mesh("BAR_ARM_SWEEP_M", 0.34, 0.016, 44, 10, 292, 86),
        col, loc=(0.06, -0.06, -0.04), rot=(math.radians(18), math.radians(-12), math.radians(22)),
        parent=root, mat=mats["alum"],
    )
    # Offset vertical rail — thin, not a box
    obj_mesh(
        "BAR_ARM_RAIL",
        cube_mesh("BAR_ARM_RAIL_M", 0.034, 0.022, 1.05, 0.005),
        col, loc=(-0.10, 0.20, -0.02), rot=(0, math.radians(4), math.radians(8)),
        parent=root, mat=mats["black"],
    )
    obj_mesh(
        "BAR_ARM_RAIL_CAP_T",
        cyl_mesh("BAR_ARM_RAIL_CAP_T_M", 0.02, 0.02, 10, 0.002),
        col, loc=(-0.09, 0.22, 0.62), parent=root, mat=mats["alum"],
    )
    obj_mesh(
        "BAR_ARM_RAIL_CAP_B",
        cyl_mesh("BAR_ARM_RAIL_CAP_B_M", 0.02, 0.02, 10, 0.002),
        col, loc=(-0.07, 0.22, -0.64), parent=root, mat=mats["alum"],
    )
    # Mid collar around the core, open
    obj_mesh(
        "BAR_ARM_COLLAR",
        torus_mesh("BAR_ARM_COLLAR_M", 0.22, 0.01, 32, 8, 200, 40),
        col, loc=(0.03, -0.01, 0.05), rot=(math.radians(90), 0, math.radians(12)),
        parent=root, mat=mats["alum"],
    )


def arm_to(col, root, mats, name, start, end, radius=0.007):
    d = end - start
    length = d.length
    mid = (start + end) * 0.5
    rot = d.normalized().to_track_quat("Z", "X").to_euler()
    empty = make_empty(name, col, loc=mid, rot=rot, parent=root, size=0.04)
    obj_mesh(f"{name}_ROD", cyl_mesh(f"{name}_ROD_M", radius, length, 10, 0.001), col, parent=empty, mat=mats["graphite"])
    obj_mesh(
        f"{name}_JOINT_A", cyl_mesh(f"{name}_JA_M", radius * 1.8, radius * 2.4, 10, 0.0015),
        col, loc=(0, 0, -length * 0.5), parent=empty, mat=mats["alum"],
    )
    obj_mesh(
        f"{name}_JOINT_B", cyl_mesh(f"{name}_JB_M", radius * 1.8, radius * 2.4, 10, 0.0015),
        col, loc=(0, 0, length * 0.5), parent=empty, mat=mats["alum"],
    )
    return empty


def module_landing(empty, col, mats):
    obj_mesh("BAR_LANDING_WING", taper_mesh("BAR_LANDING_WING_M", 0.055, 0.018, 0.42, 8, 0.004),
             col, loc=(0.12, 0, 0), rot=(0, math.radians(90), math.radians(8)), parent=empty, mat=mats["alum"])
    obj_mesh("BAR_LANDING_SKIN", cube_mesh("BAR_LANDING_SKIN_M", 0.018, 0.22, 0.10, 0.004),
             col, loc=(0.08, 0.02, 0.01), rot=(0, 0, math.radians(-12)), parent=empty, mat=mats["graphite"])
    obj_mesh("BAR_LANDING_EDGE", cube_mesh("BAR_LANDING_EDGE_M", 0.006, 0.20, 0.012, 0.0015),
             col, loc=(0.16, 0.01, 0.0), parent=empty, mat=mats["black"])


def module_systems(empty, col, mats):
    for i, (w, d) in enumerate(((0.16, 0.11), (0.13, 0.09), (0.10, 0.075), (0.08, 0.06))):
        obj_mesh(
            f"BAR_SYSTEMS_PACK_{i:02d}",
            cube_mesh(f"BAR_SYSTEMS_PACK_M_{i}", 0.022, w, d, 0.003),
            col, loc=(0.05 + i * 0.026, 0.01 * (1 - i), 0.008 * i),
            parent=empty, mat=mats["graphite"] if i % 2 == 0 else mats["black"],
        )
    obj_mesh("BAR_SYSTEMS_FACE", cube_mesh("BAR_SYSTEMS_FACE_M", 0.01, 0.09, 0.07, 0.002),
             col, loc=(0.145, 0.0, 0.01), parent=empty, mat=mats["alum"])
    for i in range(3):
        obj_mesh(
            f"BAR_SYSTEMS_FIN_{i:02d}",
            cube_mesh(f"BAR_SYSTEMS_FIN_M_{i}", 0.004, 0.07, 0.008, 0.001),
            col, loc=(0.152, 0.0, -0.02 + i * 0.02), parent=empty, mat=mats["alum"],
        )


def module_automation(empty, col, mats):
    obj_mesh("BAR_AUTO_DRUM", cyl_mesh("BAR_AUTO_DRUM_M", 0.055, 0.12, 18, 0.004),
             col, loc=(0.08, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["graphite"])
    obj_mesh("BAR_AUTO_ROTOR", cyl_mesh("BAR_AUTO_ROTOR_M", 0.038, 0.016, 16, 0.002),
             col, loc=(0.15, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"])
    obj_mesh("BAR_AUTO_ROD", cyl_mesh("BAR_AUTO_ROD_M", 0.01, 0.08, 10, 0.001),
             col, loc=(0.20, 0.0, 0.0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["black"])
    obj_mesh("BAR_AUTO_SLIDE", cube_mesh("BAR_AUTO_SLIDE_M", 0.09, 0.016, 0.022, 0.002),
             col, loc=(0.10, 0.05, 0), parent=empty, mat=mats["alum"])


def module_integrations(empty, col, mats):
    obj_mesh("BAR_INT_NODE", cyl_mesh("BAR_INT_NODE_M", 0.048, 0.07, 8, 0.004),
             col, loc=(0.06, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["graphite"])
    for i, (ay, az) in enumerate(((0.07, 0.04), (0.07, -0.05), (0.0, 0.08))):
        obj_mesh(
            f"BAR_INT_PORT_{i:02d}",
            cyl_mesh(f"BAR_INT_PORT_M_{i}", 0.012, 0.07, 10, 0.0015),
            col, loc=(0.08, ay, az), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
        )
        obj_mesh(
            f"BAR_INT_SOCK_{i:02d}",
            cyl_mesh(f"BAR_INT_SOCK_M_{i}", 0.016, 0.012, 10, 0.001),
            col, loc=(0.12, ay, az), rot=(0, math.radians(90), 0), parent=empty, mat=mats["black"],
        )


def module_design(empty, col, mats):
    obj_mesh("BAR_DESIGN_LOZENGE", cube_mesh("BAR_DESIGN_LOZENGE_M", 0.028, 0.20, 0.14, 0.01),
             col, loc=(0.07, 0.01, 0.0), rot=(math.radians(8), math.radians(6), math.radians(28)),
             parent=empty, mat=mats["alum"])
    obj_mesh("BAR_DESIGN_LENS", uv_mesh("BAR_DESIGN_LENS_M", 0.042, 12, 8, (1.4, 0.35, 1.0), 0.004),
             col, loc=(0.09, 0.0, 0.0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["glass"])
    obj_mesh("BAR_DESIGN_MARK", cube_mesh("BAR_DESIGN_MARK_M", 0.003, 0.012, 0.012, 0.0006),
             col, loc=(0.086, -0.06, -0.04), parent=empty, mat=mats["graphite"])


def module_architecture(empty, col, mats):
    obj_mesh("BAR_ARCH_POST", cube_mesh("BAR_ARCH_POST_M", 0.028, 0.04, 0.26, 0.004),
             col, loc=(0.06, 0.03, 0.04), parent=empty, mat=mats["graphite"])
    obj_mesh("BAR_ARCH_BEAM", cube_mesh("BAR_ARCH_BEAM_M", 0.028, 0.20, 0.036, 0.004),
             col, loc=(0.06, -0.06, -0.08), parent=empty, mat=mats["graphite"])
    obj_mesh("BAR_ARCH_BRACE", cube_mesh("BAR_ARCH_BRACE_M", 0.014, 0.16, 0.02, 0.002),
             col, loc=(0.06, 0.0, 0.02), rot=(math.radians(32), 0, 0), parent=empty, mat=mats["alum"])
    obj_mesh("BAR_ARCH_FOOT", cyl_mesh("BAR_ARCH_FOOT_M", 0.028, 0.016, 12, 0.002),
             col, loc=(0.06, -0.12, -0.10), parent=empty, mat=mats["black"])


BUILDERS = {
    "BAR_MODULE_LANDING": module_landing,
    "BAR_MODULE_SYSTEMS": module_systems,
    "BAR_MODULE_AUTOMATION": module_automation,
    "BAR_MODULE_INTEGRATIONS": module_integrations,
    "BAR_MODULE_DESIGN": module_design,
    "BAR_MODULE_ARCHITECTURE": module_architecture,
}

# Height ~2.0, width ~1.1, depth ~0.7 — controlled asymmetry around a slightly offset core.
MODULE_LOCS = {
    "BAR_MODULE_LANDING": Vector((-0.38, 0.18, 0.44)),
    "BAR_MODULE_SYSTEMS": Vector((-0.42, 0.03, 0.04)),
    "BAR_MODULE_AUTOMATION": Vector((-0.34, -0.22, -0.30)),
    "BAR_MODULE_INTEGRATIONS": Vector((0.40, -0.22, 0.08)),
    "BAR_MODULE_DESIGN": Vector((0.34, 0.08, 0.48)),
    "BAR_MODULE_ARCHITECTURE": Vector((0.30, 0.20, -0.46)),
}

CORE_PT = Vector((0.035, -0.02, 0.04))


def build_modules(root, col, mats):
    modules = {}
    for name, loc in MODULE_LOCS.items():
        empty = make_empty(name, col, loc=loc, rot=look_out(loc - CORE_PT), parent=root, size=0.1)
        obj_mesh(
            f"{name}_IFACE",
            cyl_mesh(f"{name}_IFACE_M", 0.024, 0.028, 12, 0.002),
            col, loc=(-0.01, 0, 0), rot=(0, math.radians(90), 0), parent=empty, mat=mats["alum"],
        )
        BUILDERS[name](empty, col, mats)
        modules[name] = empty
    return modules


def build_connectors(root, col, mats, modules):
    for i, (name, mod) in enumerate(modules.items(), start=1):
        end = Vector(mod.location)
        direction = (end - CORE_PT).normalized()
        start = CORE_PT + direction * 0.24
        tip = end - direction * 0.07
        arm_to(col, root, mats, f"BAR_CONNECTOR_{i:02d}", start, tip, 0.011)


def setup_preview(col):
    for name in ("BAR_LIGHT_KEY", "BAR_LIGHT_FILL", "BAR_LIGHT_RIM", "BAR_HERO_CAMERA", "BAR_CAM_TARGET"):
        if name in bpy.data.objects:
            delete_object(bpy.data.objects[name])

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

    area("BAR_LIGHT_KEY", 480, 5.4, (-2.6, -3.8, 3.2), (math.radians(50), 0, math.radians(-24)), (1, 0.985, 0.95))
    area("BAR_LIGHT_FILL", 95, 6.2, (3.4, -2.2, 1.5), (math.radians(70), 0, math.radians(70)), (0.97, 0.97, 0.96))
    area("BAR_LIGHT_RIM", 170, 2.3, (1.4, 3.1, 2.2), (math.radians(60), 0, math.radians(155)), (1, 0.99, 0.97))

    cam_data = bpy.data.cameras.new("BAR_HERO_CAMERA")
    cam_data.lens = 58
    cam_data.sensor_width = 36
    cam = bpy.data.objects.new("BAR_HERO_CAMERA", cam_data)
    cam.location = (-0.62, -3.85, 0.38)
    link(cam, col)
    target = bpy.data.objects.new("BAR_CAM_TARGET", None)
    target.location = (0.32, 0.0, 0.04)
    link(target, col)
    track = cam.constraints.new("TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"
    bpy.context.scene.camera = cam

    world = bpy.data.worlds.get("BAR_WORLD_PREVIEW") or bpy.data.worlds.new("BAR_WORLD_PREVIEW")
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.93, 0.93, 0.91, 1)
        bg.inputs[1].default_value = 0.6
    bpy.context.scene.world = world
    if hasattr(bpy.context.scene.eevee, "use_raytracing"):
        bpy.context.scene.eevee.use_raytracing = True


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


def count_tris():
    total = 0
    for obj in bpy.data.objects:
        if obj.type != "MESH" or obj.name.startswith("BAR_LIGHT"):
            continue
        obj.data.calc_loop_triangles()
        total += len(obj.data.loop_triangles)
    return total


def render_views():
    scene = bpy.context.scene
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_x = 1100
    scene.render.resolution_y = 1300
    scene.render.film_transparent = False
    hero = bpy.data.objects["BAR_HERO_CAMERA"]
    scene.camera = hero
    scene.render.filepath = f"{PREVIEW_DIR}/qc_hero.png"
    bpy.ops.render.render(write_still=True)

    views = {
        "qc_front.png": ((0.15, -4.2, 0.1), (0.1, 0, 0.05)),
        "qc_threequarter.png": ((-1.6, -3.4, 0.7), (0.1, 0, 0.05)),
        "qc_side.png": ((3.6, 0.1, 0.15), (0.05, 0, 0.04)),
        "qc_elevated.png": ((-0.8, -3.0, 2.4), (0.1, 0, 0.05)),
    }
    cam = bpy.data.objects.new("BAR_QC_CAM", bpy.data.cameras.new("BAR_QC_CAM"))
    bpy.context.collection.objects.link(cam)
    cam.data.lens = 58
    tgt = bpy.data.objects.new("BAR_QC_TARGET", None)
    bpy.context.collection.objects.link(tgt)
    tr = cam.constraints.new("TRACK_TO")
    tr.target = tgt
    tr.track_axis = "TRACK_NEGATIVE_Z"
    tr.up_axis = "UP_Y"
    scene.camera = cam
    for fname, (cloc, tloc) in views.items():
        cam.location = cloc
        tgt.location = tloc
        scene.render.filepath = f"{PREVIEW_DIR}/{fname}"
        bpy.ops.render.render(write_still=True)
    scene.camera = hero
    delete_object(cam)
    delete_object(tgt)


def redesign():
    scene = bpy.context.scene
    engine_col = bpy.data.collections.get("BARENCHI_ENGINE") or bpy.data.collections.new("BARENCHI_ENGINE")
    if engine_col.name not in scene.collection.children:
        scene.collection.children.link(engine_col)
    preview_col = bpy.data.collections.get("BARENCHI_PREVIEW") or bpy.data.collections.new("BARENCHI_PREVIEW")
    if preview_col.name not in scene.collection.children:
        scene.collection.children.link(preview_col)

    root = bpy.data.objects.get("BARENCHI_ENGINE_ROOT")
    if root is None:
        root = make_empty("BARENCHI_ENGINE_ROOT", engine_col, size=0.2)
    else:
        link(root, engine_col)
        root.location = (0, 0, 0)
        root.rotation_euler = (0, 0, 0)
        root.animation_data_clear()

    clear_engine_geometry(root)
    engine_col = bpy.data.collections.get("BARENCHI_ENGINE") or bpy.data.collections.new("BARENCHI_ENGINE")
    if engine_col.name not in scene.collection.children:
        scene.collection.children.link(engine_col)
    preview_col = bpy.data.collections.get("BARENCHI_PREVIEW") or bpy.data.collections.new("BARENCHI_PREVIEW")
    if preview_col.name not in scene.collection.children:
        scene.collection.children.link(preview_col)
    link(root, engine_col)
    purge_unused()
    mats = materials()
    build_core(root, engine_col, mats)
    build_structure(root, engine_col, mats)
    build_rings(root, engine_col, mats)
    modules = build_modules(root, engine_col, mats)
    build_connectors(root, engine_col, mats, modules)
    setup_preview(preview_col)
    set_preview_view()
    tris = count_tris()
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    render_views()
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    return {
        "tris": tris,
        "objects": [o.name for o in engine_col.objects],
        "materials": [m.name for m in bpy.data.materials if m.name.startswith("BAR_")],
    }


RESULT = redesign()
print("REDESIGN_OK", RESULT["tris"], RESULT["materials"])
