import { Vector3 as u } from "three";
class X {
  /**
   * Parses the given 3D object and generates the STL output.
   *
   * If the 3D object is composed of multiple children and geometry, they are merged into a single mesh in the file.
   *
   * @param {Object3D} scene - A scene, mesh or any other 3D object containing meshes to encode.
   * @param {STLExporter~Options} options - The export options.
   * @return {string|ArrayBuffer} The exported STL.
   */
  parse(M, x = {}) {
    x = Object.assign({
      binary: false
    }, x);
    const f = x.binary, y = [];
    let d = 0;
    M.traverse(function(t) {
      if (t.isMesh) {
        const r = t.geometry, i = r.index, a = r.getAttribute("position");
        d += i !== null ? i.count / 3 : a.count / 3, y.push({
          object3d: t,
          geometry: r
        });
      }
    });
    let e, n = 80;
    if (f === true) {
      const t = d * 2 + d * 3 * 4 * 4 + 80 + 4, r = new ArrayBuffer(t);
      e = new DataView(r), e.setUint32(n, d, true), n += 4;
    } else
      e = "", e += `solid exported
`;
    const c = new u(), p = new u(), m = new u(), g = new u(), z = new u(), l = new u();
    for (let t = 0, r = y.length; t < r; t++) {
      const i = y[t].object3d, a = y[t].geometry, o = a.index, b = a.getAttribute("position");
      if (o !== null)
        for (let s = 0; s < o.count; s += 3) {
          const B = o.getX(s + 0), A = o.getX(s + 1), F = o.getX(s + 2);
          h(B, A, F, b, i);
        }
      else
        for (let s = 0; s < b.count; s += 3) {
          const B = s + 0, A = s + 1, F = s + 2;
          h(B, A, F, b, i);
        }
    }
    return f === false && (e += `endsolid exported
`), e;
    function h(t, r, i, a, o) {
      c.fromBufferAttribute(a, t), p.fromBufferAttribute(a, r), m.fromBufferAttribute(a, i), o.isSkinnedMesh === true && (o.applyBoneTransform(t, c), o.applyBoneTransform(r, p), o.applyBoneTransform(i, m)), c.applyMatrix4(o.matrixWorld), p.applyMatrix4(o.matrixWorld), m.applyMatrix4(o.matrixWorld), V(c, p, m), w(c), w(p), w(m), f === true ? (e.setUint16(n, 0, true), n += 2) : (e += `		endloop
`, e += `	endfacet
`);
    }
    function V(t, r, i) {
      g.subVectors(i, r), z.subVectors(t, r), g.cross(z).normalize(), l.copy(g).normalize(), f === true ? (e.setFloat32(n, l.x, true), n += 4, e.setFloat32(n, l.y, true), n += 4, e.setFloat32(n, l.z, true), n += 4) : (e += "	facet normal " + l.x + " " + l.y + " " + l.z + `
`, e += `		outer loop
`);
    }
    function w(t) {
      f === true ? (e.setFloat32(n, t.x, true), n += 4, e.setFloat32(n, t.y, true), n += 4, e.setFloat32(n, t.z, true), n += 4) : e += "			vertex " + t.x + " " + t.y + " " + t.z + `
`;
    }
  }
}
export {
  X as STLExporter
};
