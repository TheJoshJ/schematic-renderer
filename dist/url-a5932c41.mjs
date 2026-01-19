import { c as yt } from "./index-c7929a23.mjs";
function dt(t, h) {
  for (var e = 0; e < h.length; e++) {
    const s = h[e];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const n in s)
        if (n !== "default" && !(n in t)) {
          const p = Object.getOwnPropertyDescriptor(s, n);
          p && Object.defineProperty(t, n, p.get ? p : {
            enumerable: true,
            get: () => s[n]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var Z = {}, tt = { exports: {} };
/*! https://mths.be/punycode v1.3.2 by @mathias */
tt.exports;
(function(t, h) {
  (function(e) {
    var s = h && !h.nodeType && h, n = t && !t.nodeType && t, p = typeof globalThis == "object" && globalThis;
    (p.global === p || p.window === p || p.self === p) && (e = p);
    var l, f = 2147483647, i = 36, o = 1, c = 26, v = 38, g = 700, y = 72, w = 128, C = "-", U = /^xn--/, D = /[^\x20-\x7E]/, j = /[\x2E\u3002\uFF0E\uFF61]/g, Y = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    }, $ = i - o, A = Math.floor, L = String.fromCharCode, z;
    function F(r) {
      throw RangeError(Y[r]);
    }
    function E(r, a) {
      for (var u = r.length, m = []; u--; )
        m[u] = a(r[u]);
      return m;
    }
    function Q(r, a) {
      var u = r.split("@"), m = "";
      u.length > 1 && (m = u[0] + "@", r = u[1]), r = r.replace(j, ".");
      var d = r.split("."), O = E(d, a).join(".");
      return m + O;
    }
    function N(r) {
      for (var a = [], u = 0, m = r.length, d, O; u < m; )
        d = r.charCodeAt(u++), d >= 55296 && d <= 56319 && u < m ? (O = r.charCodeAt(u++), (O & 64512) == 56320 ? a.push(((d & 1023) << 10) + (O & 1023) + 65536) : (a.push(d), u--)) : a.push(d);
      return a;
    }
    function G(r) {
      return E(r, function(a) {
        var u = "";
        return a > 65535 && (a -= 65536, u += L(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), u += L(a), u;
      }).join("");
    }
    function k(r) {
      return r - 48 < 10 ? r - 22 : r - 65 < 26 ? r - 65 : r - 97 < 26 ? r - 97 : i;
    }
    function B(r, a) {
      return r + 22 + 75 * (r < 26) - ((a != 0) << 5);
    }
    function nt(r, a, u) {
      var m = 0;
      for (r = u ? A(r / g) : r >> 1, r += A(r / a); r > $ * c >> 1; m += i)
        r = A(r / $);
      return A(m + ($ + 1) * r / (r + v));
    }
    function ht(r) {
      var a = [], u = r.length, m, d = 0, O = w, b = y, I, q, M, _, x, P, T, S, K;
      for (I = r.lastIndexOf(C), I < 0 && (I = 0), q = 0; q < I; ++q)
        r.charCodeAt(q) >= 128 && F("not-basic"), a.push(r.charCodeAt(q));
      for (M = I > 0 ? I + 1 : 0; M < u; ) {
        for (_ = d, x = 1, P = i; M >= u && F("invalid-input"), T = k(r.charCodeAt(M++)), (T >= i || T > A((f - d) / x)) && F("overflow"), d += T * x, S = P <= b ? o : P >= b + c ? c : P - b, !(T < S); P += i)
          K = i - S, x > A(f / K) && F("overflow"), x *= K;
        m = a.length + 1, b = nt(d - _, m, _ == 0), A(d / m) > f - O && F("overflow"), O += A(d / m), d %= m, a.splice(d++, 0, O);
      }
      return G(a);
    }
    function at(r) {
      var a, u, m, d, O, b, I, q, M, _, x, P = [], T, S, K, et;
      for (r = N(r), T = r.length, a = w, u = 0, O = y, b = 0; b < T; ++b)
        x = r[b], x < 128 && P.push(L(x));
      for (m = d = P.length, d && P.push(C); m < T; ) {
        for (I = f, b = 0; b < T; ++b)
          x = r[b], x >= a && x < I && (I = x);
        for (S = m + 1, I - a > A((f - u) / S) && F("overflow"), u += (I - a) * S, a = I, b = 0; b < T; ++b)
          if (x = r[b], x < a && ++u > f && F("overflow"), x == a) {
            for (q = u, M = i; _ = M <= O ? o : M >= O + c ? c : M - O, !(q < _); M += i)
              et = q - _, K = i - _, P.push(
                L(B(_ + et % K, 0))
              ), q = A(et / K);
            P.push(L(B(q, 0))), O = nt(u, S, m == d), u = 0, ++m;
          }
        ++u, ++a;
      }
      return P.join("");
    }
    function pt(r) {
      return Q(r, function(a) {
        return U.test(a) ? ht(a.slice(4).toLowerCase()) : a;
      });
    }
    function mt(r) {
      return Q(r, function(a) {
        return D.test(a) ? "xn--" + at(a) : a;
      });
    }
    if (l = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      version: "1.3.2",
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      ucs2: {
        decode: N,
        encode: G
      },
      decode: ht,
      encode: at,
      toASCII: mt,
      toUnicode: pt
    }, s && n)
      if (t.exports == s)
        n.exports = l;
      else
        for (z in l)
          l.hasOwnProperty(z) && (s[z] = l[z]);
    else
      e.punycode = l;
  })(yt);
})(tt, tt.exports);
var gt = tt.exports, W = {};
function bt(t, h) {
  return Object.prototype.hasOwnProperty.call(t, h);
}
var xt = function(t, h, e, s) {
  h = h || "&", e = e || "=";
  var n = {};
  if (typeof t != "string" || t.length === 0)
    return n;
  var p = /\+/g;
  t = t.split(h);
  var l = 1e3;
  s && typeof s.maxKeys == "number" && (l = s.maxKeys);
  var f = t.length;
  l > 0 && f > l && (f = l);
  for (var i = 0; i < f; ++i) {
    var o = t[i].replace(p, "%20"), c = o.indexOf(e), v, g, y, w;
    c >= 0 ? (v = o.substr(0, c), g = o.substr(c + 1)) : (v = o, g = ""), y = decodeURIComponent(v), w = decodeURIComponent(g), bt(n, y) ? Array.isArray(n[y]) ? n[y].push(w) : n[y] = [n[y], w] : n[y] = w;
  }
  return n;
}, J = function(t) {
  switch (typeof t) {
    case "string":
      return t;
    case "boolean":
      return t ? "true" : "false";
    case "number":
      return isFinite(t) ? t : "";
    default:
      return "";
  }
}, vt = function(t, h, e, s) {
  return h = h || "&", e = e || "=", t === null && (t = void 0), typeof t == "object" ? Object.keys(t).map(function(n) {
    var p = encodeURIComponent(J(n)) + e;
    return Array.isArray(t[n]) ? t[n].map(function(l) {
      return p + encodeURIComponent(J(l));
    }).join(h) : p + encodeURIComponent(J(t[n]));
  }).join(h) : s ? encodeURIComponent(J(s)) + e + encodeURIComponent(J(t)) : "";
};
W.decode = W.parse = xt;
W.encode = W.stringify = vt;
var Ct = gt, Ot = Z.parse = X, At = Z.resolve = _t, wt = Z.resolveObject = Lt, jt = Z.format = Dt, Ft = Z.Url = R;
function R() {
  this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var It = /^([a-z0-9.+-]+:)/i, Ut = /:[0-9]*$/, Pt = ["<", ">", '"', "`", " ", "\r", `
`, "	"], Rt = ["{", "}", "|", "\\", "^", "`"].concat(Pt), st = ["'"].concat(Rt), it = ["%", "/", "?", ";", "#"].concat(st), ft = ["/", "?", "#"], qt = 255, ut = /^[a-z0-9A-Z_-]{0,63}$/, Tt = /^([a-z0-9A-Z_-]{0,63})(.*)$/, Mt = {
  javascript: true,
  "javascript:": true
}, rt = {
  javascript: true,
  "javascript:": true
}, V = {
  http: true,
  https: true,
  ftp: true,
  gopher: true,
  file: true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
}, ct = W;
function X(t, h, e) {
  if (t && lt(t) && t instanceof R)
    return t;
  var s = new R();
  return s.parse(t, h, e), s;
}
R.prototype.parse = function(t, h, e) {
  if (!ot(t))
    throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
  var s = t;
  s = s.trim();
  var n = It.exec(s);
  if (n) {
    n = n[0];
    var p = n.toLowerCase();
    this.protocol = p, s = s.substr(n.length);
  }
  if (e || n || s.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var l = s.substr(0, 2) === "//";
    l && !(n && rt[n]) && (s = s.substr(2), this.slashes = true);
  }
  if (!rt[n] && (l || n && !V[n])) {
    for (var f = -1, i = 0; i < ft.length; i++) {
      var o = s.indexOf(ft[i]);
      o !== -1 && (f === -1 || o < f) && (f = o);
    }
    var c, v;
    f === -1 ? v = s.lastIndexOf("@") : v = s.lastIndexOf("@", f), v !== -1 && (c = s.slice(0, v), s = s.slice(v + 1), this.auth = decodeURIComponent(c)), f = -1;
    for (var i = 0; i < it.length; i++) {
      var o = s.indexOf(it[i]);
      o !== -1 && (f === -1 || o < f) && (f = o);
    }
    f === -1 && (f = s.length), this.host = s.slice(0, f), s = s.slice(f), this.parseHost(), this.hostname = this.hostname || "";
    var g = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!g)
      for (var y = this.hostname.split(/\./), i = 0, w = y.length; i < w; i++) {
        var C = y[i];
        if (C && !C.match(ut)) {
          for (var U = "", D = 0, j = C.length; D < j; D++)
            C.charCodeAt(D) > 127 ? U += "x" : U += C[D];
          if (!U.match(ut)) {
            var Y = y.slice(0, i), $ = y.slice(i + 1), A = C.match(Tt);
            A && (Y.push(A[1]), $.unshift(A[2])), $.length && (s = "/" + $.join(".") + s), this.hostname = Y.join(".");
            break;
          }
        }
      }
    if (this.hostname.length > qt ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), !g) {
      for (var L = this.hostname.split("."), z = [], i = 0; i < L.length; ++i) {
        var F = L[i];
        z.push(F.match(/[^A-Za-z0-9_-]/) ? "xn--" + Ct.encode(F) : F);
      }
      this.hostname = z.join(".");
    }
    var E = this.port ? ":" + this.port : "", Q = this.hostname || "";
    this.host = Q + E, this.href += this.host, g && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), s[0] !== "/" && (s = "/" + s));
  }
  if (!Mt[p])
    for (var i = 0, w = st.length; i < w; i++) {
      var N = st[i], G = encodeURIComponent(N);
      G === N && (G = escape(N)), s = s.split(N).join(G);
    }
  var k = s.indexOf("#");
  k !== -1 && (this.hash = s.substr(k), s = s.slice(0, k));
  var B = s.indexOf("?");
  if (B !== -1 ? (this.search = s.substr(B), this.query = s.substr(B + 1), h && (this.query = ct.parse(this.query)), s = s.slice(0, B)) : h && (this.search = "", this.query = {}), s && (this.pathname = s), V[p] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
    var E = this.pathname || "", F = this.search || "";
    this.path = E + F;
  }
  return this.href = this.format(), this;
};
function Dt(t) {
  return ot(t) && (t = X(t)), t instanceof R ? t.format() : R.prototype.format.call(t);
}
R.prototype.format = function() {
  var t = this.auth || "";
  t && (t = encodeURIComponent(t), t = t.replace(/%3A/i, ":"), t += "@");
  var h = this.protocol || "", e = this.pathname || "", s = this.hash || "", n = false, p = "";
  this.host ? n = t + this.host : this.hostname && (n = t + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (n += ":" + this.port)), this.query && lt(this.query) && Object.keys(this.query).length && (p = ct.stringify(this.query));
  var l = this.search || p && "?" + p || "";
  return h && h.substr(-1) !== ":" && (h += ":"), this.slashes || (!h || V[h]) && n !== false ? (n = "//" + (n || ""), e && e.charAt(0) !== "/" && (e = "/" + e)) : n || (n = ""), s && s.charAt(0) !== "#" && (s = "#" + s), l && l.charAt(0) !== "?" && (l = "?" + l), e = e.replace(/[?#]/g, function(f) {
    return encodeURIComponent(f);
  }), l = l.replace("#", "%23"), h + n + e + l + s;
};
function _t(t, h) {
  return X(t, false, true).resolve(h);
}
R.prototype.resolve = function(t) {
  return this.resolveObject(X(t, false, true)).format();
};
function Lt(t, h) {
  return t ? X(t, false, true).resolveObject(h) : h;
}
R.prototype.resolveObject = function(t) {
  if (ot(t)) {
    var h = new R();
    h.parse(t, false, true), t = h;
  }
  var e = new R();
  if (Object.keys(this).forEach(function(j) {
    e[j] = this[j];
  }, this), e.hash = t.hash, t.href === "")
    return e.href = e.format(), e;
  if (t.slashes && !t.protocol)
    return Object.keys(t).forEach(function(j) {
      j !== "protocol" && (e[j] = t[j]);
    }), V[e.protocol] && e.hostname && !e.pathname && (e.path = e.pathname = "/"), e.href = e.format(), e;
  if (t.protocol && t.protocol !== e.protocol) {
    if (!V[t.protocol])
      return Object.keys(t).forEach(function(j) {
        e[j] = t[j];
      }), e.href = e.format(), e;
    if (e.protocol = t.protocol, !t.host && !rt[t.protocol]) {
      for (var c = (t.pathname || "").split("/"); c.length && !(t.host = c.shift()); )
        ;
      t.host || (t.host = ""), t.hostname || (t.hostname = ""), c[0] !== "" && c.unshift(""), c.length < 2 && c.unshift(""), e.pathname = c.join("/");
    } else
      e.pathname = t.pathname;
    if (e.search = t.search, e.query = t.query, e.host = t.host || "", e.auth = t.auth, e.hostname = t.hostname || t.host, e.port = t.port, e.pathname || e.search) {
      var s = e.pathname || "", n = e.search || "";
      e.path = s + n;
    }
    return e.slashes = e.slashes || t.slashes, e.href = e.format(), e;
  }
  var p = e.pathname && e.pathname.charAt(0) === "/", l = t.host || t.pathname && t.pathname.charAt(0) === "/", f = l || p || e.host && t.pathname, i = f, o = e.pathname && e.pathname.split("/") || [], c = t.pathname && t.pathname.split("/") || [], v = e.protocol && !V[e.protocol];
  if (v && (e.hostname = "", e.port = null, e.host && (o[0] === "" ? o[0] = e.host : o.unshift(e.host)), e.host = "", t.protocol && (t.hostname = null, t.port = null, t.host && (c[0] === "" ? c[0] = t.host : c.unshift(t.host)), t.host = null), f = f && (c[0] === "" || o[0] === "")), l)
    e.host = t.host || t.host === "" ? t.host : e.host, e.hostname = t.hostname || t.hostname === "" ? t.hostname : e.hostname, e.search = t.search, e.query = t.query, o = c;
  else if (c.length)
    o || (o = []), o.pop(), o = o.concat(c), e.search = t.search, e.query = t.query;
  else if (!St(t.search)) {
    if (v) {
      e.hostname = e.host = o.shift();
      var g = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : false;
      g && (e.auth = g.shift(), e.host = e.hostname = g.shift());
    }
    return e.search = t.search, e.query = t.query, (!H(e.pathname) || !H(e.search)) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.href = e.format(), e;
  }
  if (!o.length)
    return e.pathname = null, e.search ? e.path = "/" + e.search : e.path = null, e.href = e.format(), e;
  for (var y = o.slice(-1)[0], w = (e.host || t.host) && (y === "." || y === "..") || y === "", C = 0, U = o.length; U >= 0; U--)
    y = o[U], y == "." ? o.splice(U, 1) : y === ".." ? (o.splice(U, 1), C++) : C && (o.splice(U, 1), C--);
  if (!f && !i)
    for (; C--; C)
      o.unshift("..");
  f && o[0] !== "" && (!o[0] || o[0].charAt(0) !== "/") && o.unshift(""), w && o.join("/").substr(-1) !== "/" && o.push("");
  var D = o[0] === "" || o[0] && o[0].charAt(0) === "/";
  if (v) {
    e.hostname = e.host = D ? "" : o.length ? o.shift() : "";
    var g = e.host && e.host.indexOf("@") > 0 ? e.host.split("@") : false;
    g && (e.auth = g.shift(), e.host = e.hostname = g.shift());
  }
  return f = f || e.host && o.length, f && !D && o.unshift(""), o.length ? e.pathname = o.join("/") : (e.pathname = null, e.path = null), (!H(e.pathname) || !H(e.search)) && (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.auth = t.auth || e.auth, e.slashes = e.slashes || t.slashes, e.href = e.format(), e;
};
R.prototype.parseHost = function() {
  var t = this.host, h = Ut.exec(t);
  h && (h = h[0], h !== ":" && (this.port = h.substr(1)), t = t.substr(0, t.length - h.length)), t && (this.hostname = t);
};
function ot(t) {
  return typeof t == "string";
}
function lt(t) {
  return typeof t == "object" && t !== null;
}
function H(t) {
  return t === null;
}
function St(t) {
  return t == null;
}
const zt = /* @__PURE__ */ dt({
  __proto__: null,
  Url: Ft,
  default: Z,
  format: jt,
  parse: Ot,
  resolve: At,
  resolveObject: wt
}, [Z]);
export {
  zt as u
};
