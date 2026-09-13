"""Refinement pass: fewer parts, stronger connections, hero framing. No GLB."""
from __future__ import annotations

import math
from mathutils import Vector

import bmesh
import bpy

BLEND = "/home/beranrdocs/Downloads/Barenchi/Site Barenchi/barenchi_engine_master.blend"
HERO = "/home/beranrdocs/Downloads/Barenchi/Site Barenchi/barenchi_export/qc_hero.png"
CORE = Vector((0.035, -0.02, 0.04))

REMOVE = [
    "BAR_CORE_STRUT_00", "BAR_CORE_STRUT_01", "BAR_CORE_STRUT_02",
    "BAR_CORE_LAYER", "BAR_CORE_BAND_00", "BAR_CORE_BAND_02",
    "BAR_ARM_RAIL_CAP_T", "BAR_ARM_RAIL_CAP_B", "BAR_ARM_SWEEP",
    "BAR_LANDING_EDGE", "BAR_DESIGN_MARK", "BAR_AUTO_ROD",
    "BAR_SYSTEMS_FIN_00", "BAR_SYSTEMS_FIN_01", "BAR_SYSTEMS_FIN_02",
    "BAR_INT_SOCK_00", "BAR_INT_SOCK_01", "BAR_INT_SOCK_02",
    "BAR_RING_PRIMARY_COLLAR_A", "BAR_RING_PRIMARY_COLLAR_B",
    "BAR_RING_SECONDARY_COLLAR_A", "BAR_RING_SECONDARY_COLLAR_B",
    "BAR_RING_TERTIARY_COLLAR_A", "BAR_RING_TERTIARY_COLLAR_B",
]

# Pull modules inward so they sit on the architecture, not at antenna tips.
MODULE_LOCS = {
    "BAR_MODULE_LANDING": Vector((-0.30, 0.14, 0.34)),
    "BAR_MODULE_SYSTEMS": Vector((-0.34, 0.04, 0.05)),
    "BAR_MODULE_AUTOMATION": Vector((-0.28, -0.16, -0.22)),
    "BAR_MODULE_INTEGRATIONS": Vector((0.32, -0.16, 0.07)),
    "BAR_MODULE_DESIGN": Vector((0.28, 0.06, 0.36)),
    "BAR_MODULE_ARCHITECTURE": Vector((0.24, 0.16, -0.34)),
}


def delete(name):
    obj = bpy.data.objects.get(name)
    if not obj:
        return
    mesh = obj.data if obj.type == "MESH" else None
    bpy.data.objects.remove(obj, do_unlink=True)
    if mesh and mesh.users == 0:
        bpy.data.meshes.remove(mesh)


def delete_tree(name):
    obj = bpy.data.objects.get(name)
    if not obj:
        return
    for child in list(obj.children):
        delete_tree(child.name)
    delete(name)


def shade(obj):
    try:
        obj.data.shade_smooth()
    except Exception:
        pass


def mesh_cyl(name, r, depth, segs=12, bevel=0.0015):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r, radius2=r, depth=depth)
    if bevel:
        bm.edges.ensure_lookup_table()
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel, segments=2, affect="EDGES", profile=0.7)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return me


def link_mesh(name, mesh, loc, rot, parent, mat, col):
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.rotation_euler = rot
    col.objects.link(obj)
    obj.parent = parent
    if mat:
        obj.data.materials.append(mat)
    shade(obj)
    return obj


def refine_materials():
    def set_in(mat, names, value):
        bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        for n in names:
            if n in bsdf.inputs:
                try:
                    bsdf.inputs[n].default_value = value
                except Exception:
                    pass
                return

    g = bpy.data.materials["BAR_METAL_GRAPHITE"]
    set_in(g, ("Base Color",), (0.09, 0.09, 0.086, 1))
    set_in(g, ("Metallic",), 0.9)
    set_in(g, ("Roughness",), 0.5)
    set_in(g, ("Coat Weight", "Clearcoat"), 0.08)

    b = bpy.data.materials["BAR_METAL_BLACK"]
    set_in(b, ("Base Color",), (0.014, 0.014, 0.013, 1))
    set_in(b, ("Metallic",), 0.68)
    set_in(b, ("Roughness",), 0.46)

    a = bpy.data.materials["BAR_METAL_ALUMINUM"]
    set_in(a, ("Base Color",), (0.44, 0.435, 0.415, 1))
    set_in(a, ("Metallic",), 1.0)
    set_in(a, ("Roughness",), 0.38)
    set_in(a, ("Coat Weight", "Clearcoat"), 0.12)
    set_in(a, ("Coat Roughness", "Clearcoat Roughness"), 0.35)

    gl = bpy.data.materials["BAR_SMOKED_GLASS"]
    set_in(gl, ("Base Color",), (0.08, 0.08, 0.075, 1))
    set_in(gl, ("Roughness",), 0.1)
    set_in(gl, ("Transmission Weight", "Transmission"), 0.84)
    set_in(gl, ("IOR",), 1.5)

    em = bpy.data.materials["BAR_CORE_EMISSION"]
    set_in(em, ("Emission Strength",), 1.15)
    set_in(em, ("Emission Color", "Emission"), (1.0, 0.93, 0.82, 1))


def look_out(vec: Vector):
    return vec.normalized().to_track_quat("X", "Z").to_euler()


def rebuild_connectors(root, col, mats):
    for i in range(1, 7):
        delete_tree(f"BAR_CONNECTOR_{i:02d}")
        delete_tree(f"BAR_CONNECTOR_{i:02d}A")
        delete_tree(f"BAR_CONNECTOR_{i:02d}B")
        delete(f"BAR_CONNECTOR_{i:02d}_ELBOW")

    for i, (name, loc) in enumerate(MODULE_LOCS.items(), start=1):
        direction = (loc - CORE).normalized()
        start = CORE + direction * 0.20
        end = loc - direction * 0.055
        mid = (start + end) * 0.5
        length = (end - start).length
        rot = direction.to_track_quat("Z", "X").to_euler()
        empty = bpy.data.objects.new(f"BAR_CONNECTOR_{i:02d}", None)
        empty.empty_display_type = "PLAIN_AXES"
        empty.empty_display_size = 0.04
        empty.location = mid
        empty.rotation_euler = rot
        empty.parent = root
        col.objects.link(empty)
        # Sleeve, not a stick: thicker, shorter, collared.
        link_mesh(
            f"BAR_CONNECTOR_{i:02d}_ROD",
            mesh_cyl(f"BAR_CONN_ROD_M_{i}", 0.013, length, 14, 0.002),
            (0, 0, 0), (0, 0, 0), empty, mats["graphite"], col,
        )
        link_mesh(
            f"BAR_CONNECTOR_{i:02d}_JOINT_A",
            mesh_cyl(f"BAR_CONN_JA_M_{i}", 0.02, 0.022, 12, 0.002),
            (0, 0, -length * 0.5), (0, 0, 0), empty, mats["alum"], col,
        )
        link_mesh(
            f"BAR_CONNECTOR_{i:02d}_JOINT_B",
            mesh_cyl(f"BAR_CONN_JB_M_{i}", 0.018, 0.02, 12, 0.002),
            (0, 0, length * 0.5), (0, 0, 0), empty, mats["black"], col,
        )


def place_modules():
    for name, loc in MODULE_LOCS.items():
        obj = bpy.data.objects[name]
        obj.scale = (1.0, 1.0, 1.0)
        obj.location = loc
        obj.rotation_euler = look_out(loc - CORE)


def bbox_world(objects):
    mins = Vector((1e9, 1e9, 1e9))
    maxs = Vector((-1e9, -1e9, -1e9))
    for obj in objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            w = obj.matrix_world @ Vector(corner)
            mins.x, mins.y, mins.z = min(mins.x, w.x), min(mins.y, w.y), min(mins.z, w.z)
            maxs.x, maxs.y, maxs.z = max(maxs.x, w.x), max(maxs.y, w.y), max(maxs.z, w.z)
    return mins, maxs


def frame_hero():
    root = bpy.data.objects["BARENCHI_ENGINE_ROOT"]
    meshes = [o for o in bpy.data.objects if o.type == "MESH" and o.name.startswith("BAR_") and not o.name.startswith("BAR_LIGHT")]
    mins, maxs = bbox_world(meshes)
    center = (mins + maxs) * 0.5
    size = maxs - mins
    # Bias object to the right: look slightly left of center.
    look = Vector((center.x + 0.22, center.y, center.z))
    cam = bpy.data.objects["BAR_HERO_CAMERA"]
    tgt = bpy.data.objects["BAR_CAM_TARGET"]
    tgt.location = look
    cam.data.lens = 55
    cam.data.sensor_width = 36
    # Vertical FOV from resolution
    scene = bpy.context.scene
    aspect = scene.render.resolution_y / scene.render.resolution_x
    sensor_h = 36 * aspect
    vfov = 2 * math.atan((sensor_h * 0.5) / cam.data.lens)
    fill = 0.70
    dist = (size.z * 0.5) / max(math.tan(vfov * 0.5) * fill, 1e-4)
    dist = max(dist, size.y * 1.15 + 1.6)
    cam.location = Vector((look.x - 0.55, look.y - dist, look.z + 0.18))
    return size, dist, look


def set_view():
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
    n = 0
    for obj in bpy.data.objects:
        if obj.type != "MESH" or obj.name.startswith("BAR_LIGHT"):
            continue
        obj.data.calc_loop_triangles()
        n += len(obj.data.loop_triangles)
    return n


def refine():
    col = bpy.data.collections.get("BARENCHI_ENGINE") or bpy.context.scene.collection
    root = bpy.data.objects["BARENCHI_ENGINE_ROOT"]
    mats = {
        "graphite": bpy.data.materials["BAR_METAL_GRAPHITE"],
        "black": bpy.data.materials["BAR_METAL_BLACK"],
        "alum": bpy.data.materials["BAR_METAL_ALUMINUM"],
    }
    for name in REMOVE:
        delete(name)

    # Tertiary ring was arbitrarily scaled; restore and tuck it in.
    r3 = bpy.data.objects.get("BAR_RING_TERTIARY")
    if r3:
        r3.scale = (0.88, 0.88, 0.88)
        r3.rotation_euler[0] = math.radians(48)

    # Quiet the rear rail so it reads as structure, not a floating post.
    rail = bpy.data.objects.get("BAR_ARM_RAIL")
    if rail:
        rail.scale = (0.85, 0.85, 0.78)

    refine_materials()
    place_modules()
    rebuild_connectors(root, col, mats)
    scene = bpy.context.scene
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 1400
    size, dist, look = frame_hero()
    set_view()
    scene.camera = bpy.data.objects["BAR_HERO_CAMERA"]
    scene.render.filepath = HERO
    scene.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    return {"tris": count_tris(), "size": [round(x, 3) for x in size], "dist": round(dist, 3), "removed": REMOVE}


RESULT = refine()
print("REFINE_OK", RESULT)
