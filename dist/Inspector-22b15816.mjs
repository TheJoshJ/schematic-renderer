import { InspectorBase as T, TimestampQuery as x, RendererUtils as C, NoToneMapping as y, LinearSRGBColorSpace as L, TSL as e, setConsoleFunction as I, CanvasTarget as F, NodeMaterial as _, QuadMesh as R, REVISION as N } from "./three.webgpu-a0638729.mjs";
import { EventDispatcher as M } from "three";
class E {
  constructor(t, i) {
    this.uid = t, this.cid = t.match(/^(.*):f(\d+)$/)[1], this.name = i, this.timestamp = 0, this.cpu = 0, this.gpu = 0, this.fps = 0, this.children = [], this.parent = null;
  }
}
class V extends E {
  constructor(t, i, r, n) {
    let s = i.name;
    s === "" && (i.isScene ? s = "Scene" : i.isQuadMesh && (s = "QuadMesh")), super(t, s), this.scene = i, this.camera = r, this.renderTarget = n, this.isRenderStats = true;
  }
}
class P extends E {
  constructor(t, i) {
    super(t, i.name), this.computeNode = i, this.isComputeStats = true;
  }
}
class B extends T {
  constructor() {
    super(), this.currentFrame = null, this.currentRender = null, this.currentNodes = null, this.lastFrame = null, this.frames = [], this.framesLib = {}, this.maxFrames = 512, this._lastFinishTime = 0, this._resolveTimestampPromise = null, this.isRendererInspector = true;
  }
  getParent() {
    return this.currentRender || this.getFrame();
  }
  begin() {
    this.currentFrame = this._createFrame(), this.currentRender = this.currentFrame, this.currentNodes = [];
  }
  finish() {
    const t = performance.now(), i = this.currentFrame;
    i.finishTime = t, i.deltaTime = t - (this._lastFinishTime > 0 ? this._lastFinishTime : t), this.addFrame(i), this.fps = this._getFPS(), this.lastFrame = i, this.currentFrame = null, this.currentRender = null, this.currentNodes = null, this._lastFinishTime = t;
  }
  _getFPS() {
    let t = 0, i = 0;
    for (let r = this.frames.length - 1; r >= 0; r--) {
      const n = this.frames[r];
      if (t++, i += n.deltaTime, i >= 1e3)
        break;
    }
    return t * 1e3 / i;
  }
  _createFrame() {
    return {
      frameId: this.nodeFrame.frameId,
      resolvedCompute: false,
      resolvedRender: false,
      deltaTime: 0,
      startTime: performance.now(),
      finishTime: 0,
      miscellaneous: 0,
      children: [],
      renders: [],
      computes: []
    };
  }
  getFrame() {
    return this.currentFrame || this.lastFrame;
  }
  getFrameById(t) {
    return this.framesLib[t] || null;
  }
  resolveViewer() {
  }
  resolveFrame() {
  }
  async resolveTimestamp() {
    return this._resolveTimestampPromise !== null ? this._resolveTimestampPromise : (this._resolveTimestampPromise = new Promise((t) => {
      requestAnimationFrame(async () => {
        const i = this.getRenderer();
        await i.resolveTimestampsAsync(x.COMPUTE), await i.resolveTimestampsAsync(x.RENDER);
        const r = i.backend.getTimestampFrames(x.COMPUTE), n = i.backend.getTimestampFrames(x.RENDER), s = [.../* @__PURE__ */ new Set([...r, ...n])];
        for (const o of s) {
          const a = this.getFrameById(o);
          if (a !== null) {
            if (a.resolvedCompute === false)
              if (a.computes.length > 0) {
                if (r.includes(o)) {
                  for (const l of a.computes)
                    i.backend.hasTimestamp(l.uid) ? l.gpu = i.backend.getTimestamp(l.uid) : (l.gpu = 0, l.gpuNotAvailable = true);
                  a.resolvedCompute = true;
                }
              } else
                a.resolvedCompute = true;
            if (a.resolvedRender === false)
              if (a.renders.length > 0) {
                if (n.includes(o)) {
                  for (const l of a.renders)
                    i.backend.hasTimestamp(l.uid) ? l.gpu = i.backend.getTimestamp(l.uid) : (l.gpu = 0, l.gpuNotAvailable = true);
                  a.resolvedRender = true;
                }
              } else
                a.resolvedRender = true;
            a.resolvedCompute === true && a.resolvedRender === true && this.resolveFrame(a);
          }
        }
        this._resolveTimestampPromise = null, t();
      });
    }), this._resolveTimestampPromise);
  }
  get isAvailable() {
    return this.getRenderer() !== null;
  }
  addFrame(t) {
    if (this.frames.length >= this.maxFrames) {
      const i = this.frames.shift();
      delete this.framesLib[i.frameId];
    }
    this.frames.push(t), this.framesLib[t.frameId] = t, this.isAvailable && (this.resolveViewer(), this.resolveTimestamp());
  }
  inspect(t) {
    this.currentNodes.push(t);
  }
  beginCompute(t, i) {
    const r = this.getFrame();
    if (!r)
      return;
    const n = new P(t, i);
    n.timestamp = performance.now(), n.parent = this.currentCompute || this.getParent(), r.computes.push(n), this.currentRender !== null ? this.currentRender.children.push(n) : r.children.push(n), this.currentCompute = n;
  }
  finishCompute() {
    if (!this.getFrame())
      return;
    const i = this.currentCompute;
    i.cpu = performance.now() - i.timestamp, this.currentCompute = i.parent.isComputeStats ? i.parent : null;
  }
  beginRender(t, i, r, n) {
    const s = this.getFrame();
    if (!s)
      return;
    const o = new V(t, i, r, n);
    o.timestamp = performance.now(), o.parent = this.getParent(), s.renders.push(o), this.currentRender !== null ? this.currentRender.children.push(o) : s.children.push(o), this.currentRender = o;
  }
  finishRender() {
    if (!this.getFrame())
      return;
    const i = this.currentRender;
    i.cpu = performance.now() - i.timestamp, this.currentRender = i.parent;
  }
}
class z {
  static init() {
    if (document.getElementById("profiler-styles"))
      return;
    const t = `
:root {
	--profiler-bg: #1e1e24f5;
	--profiler-header-bg: #2a2a33aa;
	--profiler-header: #2a2a33;
	--profiler-border: #4a4a5a;
	--text-primary: #e0e0e0;
	--text-secondary: #9a9aab;
	--accent-color: #00aaff;
	--color-green: #4caf50;
	--color-yellow: #ffc107;
	--color-red: #f44336;
	--font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	--font-mono: 'Fira Code', 'Courier New', Courier, monospace;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Fira+Code&display=swap');

#profiler-panel *, #profiler-toggle * {
	text-transform: initial;
	line-height: normal;
	box-sizing: border-box;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#profiler-toggle {
	position: fixed;
	top: 15px;
	right: 15px;
	background-color: rgba(30, 30, 36, 0.85);
	border: 1px solid #4a4a5a54;
	border-radius: 6px 12px 12px 6px;
	color: var(--text-primary);
	cursor: pointer;
	z-index: 1001;
	transition: all 0.2s ease-in-out;
	font-size: 14px;
	backdrop-filter: blur(8px);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: stretch;
	padding: 0;
	overflow: hidden;
	font-family: var(--font-family);
}

#profiler-toggle:hover {
	border-color: var(--accent-color);
}

#profiler-toggle.hidden {
	opacity: 0;
	pointer-events: none;
}

#toggle-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	font-size: 20px;
	transition: background-color 0.2s;
}

#profiler-toggle:hover #toggle-icon {
	background-color: rgba(255, 255, 255, 0.05);
}

.toggle-separator {
	width: 1px;
	background-color: var(--profiler-border);
}

#toggle-text {
	display: flex;
	align-items: baseline;
	padding: 8px 14px;
	min-width: 80px;
	justify-content: right;
}

#toggle-text .fps-label {
	font-size: 0.7em;
	margin-left: 10px;
    color: #999;
}

#profiler-panel {
	position: fixed;
	z-index: 1001 !important;
	bottom: 0;
	left: 0;
	right: 0;
	height: 350px;
	background-color: var(--profiler-bg);
	backdrop-filter: blur(8px);
	border-top: 2px solid var(--profiler-border);
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	z-index: 1000;
	/*box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.5);*/
	transform: translateY(100%);
	transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.3s ease-out;
	font-family: var(--font-mono);
}

#profiler-panel.resizing {
	transition: none;
}

#profiler-panel.visible {
	transform: translateY(0);
}

#profiler-panel.maximized {
	height: 100vh;
}


.panel-resizer {
	position: absolute;
	top: -2px;
	left: 0;
	width: 100%;
	height: 5px;
	cursor: ns-resize;
	z-index: 1001;
}

.profiler-header {
	display: flex;
	background-color: var(--profiler-header-bg);
	border-bottom: 1px solid var(--profiler-border);
	flex-shrink: 0;
	justify-content: space-between;
	align-items: stretch;

	overflow-x: auto;
	overflow-y: hidden;
	width: calc(100% - 89px);
	height: 38px;
}

.profiler-tabs {
	display: flex;
}

.profiler-controls {
	display: flex;
	position: absolute;
	right: 0;
	top: 0;
	height: 38px;
	background: var(--profiler-header-bg);
	border-bottom: 1px solid var(--profiler-border);
}

.tab-btn {
	background: transparent;
	border: none;
	/*border-right: 1px solid var(--profiler-border);*/
	color: var(--text-secondary);
	padding: 8px 18px;
	cursor: pointer;
	display: flex;
	align-items: center;
	font-family: var(--font-family);
    font-weight: 600;
	font-size: 14px;
}

.tab-btn.active {
    border-bottom: 2px solid var(--accent-color);
	color: white;
}

#maximize-btn,
#hide-panel-btn {
	background: transparent;
	border: none;
	border-left: 1px solid var(--profiler-border);
	color: var(--text-secondary);
	width: 45px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
}

#maximize-btn:hover,
#hide-panel-btn:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: var(--text-primary);
}

.profiler-content-wrapper {
	flex-grow: 1;
	overflow: hidden;
	position: relative;
}

.profiler-content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	font-size: 13px;
	visibility: hidden;
	opacity: 0;
	transition: opacity 0.2s, visibility 0.2s;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.profiler-content.active {
	visibility: visible;
	opacity: 1;
}

.profiler-content {
	overflow: auto; /* make sure scrollbars can appear */
}

.profiler-content::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.profiler-content::-webkit-scrollbar-track {
	background: transparent;
}

.profiler-content::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	transition: background 0.3s ease;
}

.profiler-content::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.4);
}

.profiler-content::-webkit-scrollbar-corner {
	background: transparent;
}

.profiler-content {
	scrollbar-width: thin; /* "auto" | "thin" */
	scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}

.list-item-row {
	display: grid;
	align-items: center;
	padding: 4px 8px;
	border-radius: 3px;
	transition: background-color 0.2s;
	gap: 10px;
	border-bottom: none;
}

.list-item-wrapper {
	margin-top: 2px;
	margin-bottom: 2px;
}

.list-item-wrapper:first-child {
	/*margin-top: 0;*/
}

.list-item-wrapper:not(.header-wrapper):nth-child(odd) > .list-item-row {
	background-color: rgba(0,0,0,0.1);
}

.list-item-wrapper.header-wrapper>.list-item-row {
	color: var(--accent-color);
	background-color: rgba(0, 170, 255, 0.1);
}

.list-item-wrapper.header-wrapper>.list-item-row>.list-item-cell:first-child {
	font-weight: 600;
}

.list-item-row.collapsible,
.list-item-row.actionable {
	cursor: pointer;
}

.list-item-row.collapsible {
	background-color: rgba(0, 170, 255, 0.15) !important;
}

.list-item-row.collapsible.alert,
.list-item-row.alert {
	background-color: rgba(244, 67, 54, 0.1) !important;
}

@media (hover: hover) {

	.list-item-row:hover:not(.collapsible):not(.no-hover),
	.list-item-row:hover:not(.no-hover),
	.list-item-row.actionable:hover,
	.list-item-row.collapsible.actionable:hover {
		background-color: rgba(255, 255, 255, 0.05) !important;
	}

	.list-item-row.collapsible:hover {
		background-color: rgba(0, 170, 255, 0.25) !important;
	}

}

.list-item-cell {
	white-space: pre;
	display: flex;
	align-items: center;
}

.list-item-cell:not(:first-child) {
	justify-content: flex-end;
	font-weight: 600;
}

.list-header {
	display: grid;
	align-items: center;
	padding: 4px 8px;
	font-weight: 600;
	color: var(--text-secondary);
	padding-bottom: 6px;
	border-bottom: 1px solid var(--profiler-border);
	margin-bottom: 5px;
	gap: 10px;
}

.list-item-wrapper.section-start {
	margin-top: 5px;
	margin-bottom: 5px;
}

.list-header .list-header-cell:not(:first-child) {
	text-align: right;
}

.list-children-container {
	padding-left: 1.5em;
	overflow: hidden;
	transition: max-height 0.1s ease-out;
	margin-top: 2px;
}

.list-children-container.closed {
	max-height: 0;
}

.item-toggler {
	display: inline-block;
	margin-right: 0.8em;
	text-align: left;
}

.list-item-row.open .item-toggler::before {
	content: '-';
}

.list-item-row:not(.open) .item-toggler::before {
	content: '+';
}

.list-item-cell .value.good {
	color: var(--color-green);
}

.list-item-cell .value.warn {
	color: var(--color-yellow);
}

.list-item-cell .value.bad {
	color: var(--color-red);
}

.list-scroll-wrapper {
	overflow-x: auto;
	width: 100%;
}

.list-container.parameters .list-item-row:not(.collapsible) {
	height: 31px;
}

.graph-container {
	width: 100%;
	box-sizing: border-box;
	padding: 8px 0;
	position: relative;
}

.graph-svg {
	width: 100%;
	height: 80px;
	background-color: var(--profiler-header);
	border: 1px solid var(--profiler-border);
	border-radius: 4px;
}

.graph-path {
	stroke-width: 2;
	fill-opacity: 0.4;
}

.console-header {
	padding: 10px;
	border-bottom: 1px solid var(--profiler-border);
	display: flex;
	gap: 20px;
	flex-shrink: 0;
	align-items: center;
	justify-content: space-between;
}

.console-filters-group {
	display: flex;
	gap: 20px;
}

.console-filter-input {
	background-color: var(--profiler-bg);
	border: 1px solid var(--profiler-border);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 4px 8px;
	font-family: var(--font-mono);
	flex-grow: 1;
	max-width: 300px;
	border-radius: 15px;
}

#console-log {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 10px;
	overflow-y: auto;
	flex-grow: 1;
}

.log-message {
	padding: 2px 5px;
	white-space: pre-wrap;
	word-break: break-all;
	border-radius: 3px;
	line-height: 1.5 !important;
}

.log-message.hidden {
	display: none;
}

.log-message.info {
	color: var(--text-primary);
}

.log-message.warn {
	color: var(--color-yellow);
}

.log-message.error {
	color: #f9dedc;
	background-color: rgba(244, 67, 54, 0.1);
}

.log-prefix {
	color: var(--text-secondary);
	margin-right: 8px;
}

.log-code {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 3px;
	padding: 1px 4px;
}

.thumbnail-container {
	display: flex;
	align-items: center;
}

.thumbnail-svg {
	width: 40px;
	height: 22.5px;
	flex-shrink: 0;
	margin-right: 8px;
}

.param-control {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
	width: 100%;
}

.param-control input,
.param-control select,
.param-control button {
	background-color: var(--profiler-bg);
	border: 1px solid var(--profiler-border);
	color: var(--text-primary);
	border-radius: 4px;
	padding: 4px 6px;
	padding-bottom: 2px;
	font-family: var(--font-mono);
	width: 100%;
	box-sizing: border-box;
}

.param-control select {
	padding-top: 3px;
	padding-bottom: 1px;
}

.param-control input[type="number"] {
	cursor: ns-resize;
}

.param-control input[type="color"] {
	padding: 2px;
}

.param-control button {
	cursor: pointer;
	transition: background-color 0.2s;
}

.param-control button:hover {
	background-color: var(--profiler-header);
}

.param-control-vector {
	display: flex;
	gap: 5px;
}

.custom-checkbox {
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	gap: 8px;
}

.custom-checkbox input {
	display: none;
}

.custom-checkbox .checkmark {
	width: 14px;
	height: 14px;
	border: 1px solid var(--profiler-border);
	border-radius: 3px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.2s, border-color 0.2s;
}

.custom-checkbox .checkmark::after {
	content: '';
	width: 8px;
	height: 8px;
	background-color: var(--accent-color);
	border-radius: 1px;
	display: block;
	transform: scale(0);
	transition: transform 0.2s;
}

.custom-checkbox input:checked+.checkmark {
	border-color: var(--accent-color);
}

.custom-checkbox input:checked+.checkmark::after {
	transform: scale(1);
}

.param-control input[type="range"] {
	-webkit-appearance: none;
	appearance: none;
	width: 100%;
	height: 16px;
	background: var(--profiler-header);
	border-radius: 5px;
	border: 1px solid var(--profiler-border);
	outline: none;
	padding: 0px;
	padding-top: 8px;
}

.param-control input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 18px;
	height: 18px;
	background: var(--profiler-bg);
	border: 1px solid var(--accent-color);
	border-radius: 3px;
	cursor: pointer;
	margin-top: -8px;
}

.param-control input[type="range"]::-moz-range-thumb {
	width: 18px;
	height: 18px;
	background: var(--profiler-bg);
	border: 2px solid var(--accent-color);
	border-radius: 3px;
	cursor: pointer;
}

.param-control input[type="range"]::-moz-range-track {
	width: 100%;
	height: 16px;
	background: var(--profiler-header);
	border-radius: 5px;
	border: 1px solid var(--profiler-border);
}

@media screen and (max-width: 768px) and (orientation: portrait) {

	.console-filter-input {
		max-width: 100px;
	}

}
`, i = document.createElement("style");
    i.id = "profiler-styles", i.textContent = t, document.head.appendChild(i);
  }
}
class D {
  constructor() {
    this.tabs = {}, this.activeTabId = null, this.isResizing = false, this.lastHeight = 350, z.init(), this.setupShell(), this.setupResizing();
  }
  setupShell() {
    this.domElement = document.createElement("div"), this.domElement.id = "profiler-shell", this.toggleButton = document.createElement("button"), this.toggleButton.id = "profiler-toggle", this.toggleButton.innerHTML = `
<span id="toggle-text">
	<span id="fps-counter">-</span>
	<span class="fps-label">FPS</span>
</span>
<!-- <span class="toggle-separator"></span> -->
<span id="toggle-icon">
	<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-ipad-horizontal-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v5.5" /><path d="M9 17h2" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
</span>
`, this.toggleButton.onclick = () => this.togglePanel(), this.panel = document.createElement("div"), this.panel.id = "profiler-panel";
    const t = document.createElement("div");
    t.className = "profiler-header", this.tabsContainer = document.createElement("div"), this.tabsContainer.className = "profiler-tabs";
    const i = document.createElement("div");
    i.className = "profiler-controls", this.maximizeBtn = document.createElement("button"), this.maximizeBtn.id = "maximize-btn", this.maximizeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>', this.maximizeBtn.onclick = () => this.toggleMaximize();
    const r = document.createElement("button");
    r.id = "hide-panel-btn", r.textContent = "-", r.onclick = () => this.togglePanel(), i.append(this.maximizeBtn, r), t.append(this.tabsContainer, i), this.contentWrapper = document.createElement("div"), this.contentWrapper.className = "profiler-content-wrapper";
    const n = document.createElement("div");
    n.className = "panel-resizer", this.panel.append(n, t, this.contentWrapper), this.domElement.append(this.toggleButton, this.panel);
  }
  setupResizing() {
    const t = this.panel.querySelector(".panel-resizer"), i = (r) => {
      this.isResizing = true, this.panel.classList.add("resizing");
      const n = r.clientY || r.touches[0].clientY, s = this.panel.offsetHeight, o = (l) => {
        if (!this.isResizing)
          return;
        l.preventDefault();
        const c = l.clientY || l.touches[0].clientY, h = s - (c - n);
        h > 100 && h < window.innerHeight - 50 && (this.panel.style.height = `${h}px`);
      }, a = () => {
        this.isResizing = false, this.panel.classList.remove("resizing"), document.removeEventListener("mousemove", o), document.removeEventListener("mouseup", a), document.removeEventListener("touchmove", o), document.removeEventListener("touchend", a), this.panel.classList.contains("maximized") || (this.lastHeight = this.panel.offsetHeight);
      };
      document.addEventListener("mousemove", o), document.addEventListener("mouseup", a), document.addEventListener("touchmove", o, { passive: false }), document.addEventListener("touchend", a);
    };
    t.addEventListener("mousedown", i), t.addEventListener("touchstart", i);
  }
  toggleMaximize() {
    this.panel.classList.contains("maximized") ? (this.panel.classList.remove("maximized"), this.panel.style.height = `${this.lastHeight}px`, this.maximizeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>') : (this.lastHeight = this.panel.offsetHeight, this.panel.classList.add("maximized"), this.panel.style.height = "100vh", this.maximizeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>');
  }
  addTab(t) {
    this.tabs[t.id] = t, t.button.onclick = () => this.setActiveTab(t.id), this.tabsContainer.appendChild(t.button), this.contentWrapper.appendChild(t.content);
  }
  setActiveTab(t) {
    this.activeTabId && this.tabs[this.activeTabId].setActive(false), this.activeTabId = t, this.tabs[t].setActive(true);
  }
  togglePanel() {
    this.panel.classList.toggle("visible"), this.toggleButton.classList.toggle("hidden");
  }
}
class b {
  constructor(t) {
    this.id = t.toLowerCase(), this.button = document.createElement("button"), this.button.className = "tab-btn", this.button.textContent = t, this.content = document.createElement("div"), this.content.id = `${this.id}-content`, this.content.className = "profiler-content", this.isActive = false, this.isVisible = true;
  }
  setActive(t) {
    this.button.classList.toggle("active", t), this.content.classList.toggle("active", t), this.isActive = t;
  }
  show() {
    this.content.style.display = "", this.button.style.display = "", this.isVisible = true;
  }
  hide() {
    this.content.style.display = "none", this.button.style.display = "none", this.isVisible = false;
  }
}
class v {
  constructor(...t) {
    this.headers = t, this.children = [], this.domElement = document.createElement("div"), this.domElement.className = "list-container", this.domElement.style.padding = "10px", this.id = `list-${Math.random().toString(36).substr(2, 9)}`, this.domElement.dataset.listId = this.id, this.gridStyleElement = document.createElement("style"), this.domElement.appendChild(this.gridStyleElement);
    const i = document.createElement("div");
    i.className = "list-header", this.headers.forEach((r) => {
      const n = document.createElement("div");
      n.className = "list-header-cell", n.textContent = r, i.appendChild(n);
    }), this.domElement.appendChild(i);
  }
  setGridStyle(t) {
    this.gridStyleElement.textContent = `
[data-list-id="${this.id}"] > .list-header,
[data-list-id="${this.id}"] .list-item-row {
	grid-template-columns: ${t};
}
`;
  }
  add(t) {
    t.parent !== null && t.parent.remove(t), t.domElement.classList.add("header-wrapper", "section-start"), t.parent = this, this.children.push(t), this.domElement.appendChild(t.domElement);
  }
  remove(t) {
    const i = this.children.indexOf(t);
    return i !== -1 && (this.children.splice(i, 1), this.domElement.removeChild(t.domElement), t.parent = null), this;
  }
}
class A {
  constructor(t = 512) {
    this.maxPoints = t, this.lines = {}, this.limit = 0, this.limitIndex = 0, this.domElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.domElement.setAttribute("class", "graph-svg");
  }
  addLine(t, i) {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "path");
    r.setAttribute("class", "graph-path"), r.style.stroke = `var(${i})`, r.style.fill = `var(${i})`, this.domElement.appendChild(r), this.lines[t] = { path: r, color: i, points: [] };
  }
  addPoint(t, i) {
    const r = this.lines[t];
    r && (r.points.push(i), r.points.length > this.maxPoints && r.points.shift(), i > this.limit && (this.limit = i, this.limitIndex = 0));
  }
  resetLimit() {
    this.limit = 0, this.limitIndex = 0;
  }
  update() {
    const t = this.domElement.clientWidth, i = this.domElement.clientHeight;
    if (t === 0)
      return;
    const r = t / (this.maxPoints - 1);
    for (const n in this.lines) {
      const s = this.lines[n];
      let o = `M 0,${i}`;
      for (let l = 0; l < s.points.length; l++) {
        const c = l * r, h = i - s.points[l] / this.limit * i;
        o += ` L ${c},${h}`;
      }
      o += ` L ${(s.points.length - 1) * r},${i} Z`;
      const a = t - (s.points.length - 1) * r;
      s.path.setAttribute("transform", `translate(${a}, 0)`), s.path.setAttribute("d", o);
    }
    this.limitIndex++ > this.maxPoints && this.resetLimit();
  }
}
class m {
  constructor(...t) {
    this.children = [], this.isOpen = true, this.childrenContainer = null, this.parent = null, this.domElement = document.createElement("div"), this.domElement.className = "list-item-wrapper", this.itemRow = document.createElement("div"), this.itemRow.className = "list-item-row", this.userData = {}, this.data = t, this.data.forEach((i) => {
      const r = document.createElement("div");
      r.className = "list-item-cell", i instanceof HTMLElement ? r.appendChild(i) : r.append(String(i)), this.itemRow.appendChild(r);
    }), this.domElement.appendChild(this.itemRow), this.onItemClick = this.onItemClick.bind(this);
  }
  onItemClick(t) {
    t.target.closest("button, a, input, label") || this.toggle();
  }
  add(t, i = this.children.length) {
    return t.parent !== null && t.parent.remove(t), t.parent = this, this.children.splice(i, 0, t), this.itemRow.classList.add("collapsible"), this.childrenContainer || (this.childrenContainer = document.createElement("div"), this.childrenContainer.className = "list-children-container", this.childrenContainer.classList.toggle("closed", !this.isOpen), this.domElement.appendChild(this.childrenContainer), this.itemRow.addEventListener("click", this.onItemClick)), this.childrenContainer.insertBefore(
      t.domElement,
      this.childrenContainer.children[i] || null
    ), this.updateToggler(), this;
  }
  remove(t) {
    const i = this.children.indexOf(t);
    return i !== -1 && (this.children.splice(i, 1), this.childrenContainer.removeChild(t.domElement), t.parent = null, this.children.length === 0 && (this.itemRow.classList.remove("collapsible"), this.itemRow.removeEventListener("click", this.onItemClick), this.childrenContainer.remove(), this.childrenContainer = null), this.updateToggler()), this;
  }
  updateToggler() {
    const t = this.itemRow.querySelector(".list-item-cell:first-child");
    let i = this.itemRow.querySelector(".item-toggler");
    this.children.length > 0 ? (i || (i = document.createElement("span"), i.className = "item-toggler", t.prepend(i)), this.isOpen && this.itemRow.classList.add("open")) : i && i.remove();
  }
  toggle() {
    return this.isOpen = !this.isOpen, this.itemRow.classList.toggle("open", this.isOpen), this.childrenContainer && this.childrenContainer.classList.toggle("closed", !this.isOpen), this;
  }
  close() {
    return this.isOpen && this.toggle(), this;
  }
}
function p(d = null) {
  const t = document.createElement("span");
  return t.className = "value", d !== null && (t.id = d), t;
}
function g(d, t) {
  const i = d instanceof HTMLElement ? d : document.getElementById(d);
  i && i.textContent !== t && (i.textContent = t);
}
function U(d) {
  const t = d.lastIndexOf("/");
  if (t === -1)
    return {
      path: "",
      name: d.trim()
    };
  const i = d.substring(0, t).trim(), r = d.substring(t + 1).trim();
  return { path: i, name: r };
}
function O(d) {
  return d.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim();
}
class G extends b {
  constructor() {
    super("Performance");
    const t = new v("Name", "CPU", "GPU", "Total");
    t.setGridStyle("minmax(200px, 2fr) 80px 80px 80px"), t.domElement.style.minWidth = "600px";
    const i = document.createElement("div");
    i.className = "list-scroll-wrapper", i.appendChild(t.domElement), this.content.appendChild(i);
    const r = document.createElement("div");
    r.className = "graph-container";
    const n = new A();
    n.addLine("fps", "--accent-color"), r.append(n.domElement);
    const s = new m("Graph Stats", p(), p(), p("graph-fps-counter"));
    t.add(s);
    const o = new m(r);
    o.itemRow.childNodes[0].style.gridColumn = "1 / -1", s.add(o);
    const a = new m("Frame Stats", p(), p(), p());
    t.add(a);
    const l = new m("Miscellaneous & Idle", p(), p(), p());
    l.domElement.firstChild.style.backgroundColor = "#00ff0b1a", l.domElement.firstChild.classList.add("no-hover"), a.add(l), this.notInUse = /* @__PURE__ */ new Map(), this.frameStats = a, this.graphStats = s, this.graph = n, this.miscellaneous = l, this.currentRender = null, this.currentItem = null, this.frameItems = /* @__PURE__ */ new Map();
  }
  resolveStats(t, i) {
    const r = t.getStatsData(i.cid);
    let n = r.item;
    if (n === void 0)
      n = new m(p(), p(), p(), p()), i.name ? i.isComputeStats === true && (i.name = `${i.name} [ Compute ]`) : i.name = `Unnamed ${i.cid}`, n.userData.name = i.name, this.currentItem.add(n), r.item = n;
    else {
      n.userData.name = i.name, this.notInUse.has(i.cid) && (n.domElement.firstElementChild.classList.remove("alert"), this.notInUse.delete(i.cid));
      const a = i.parent.children.indexOf(i);
      (n.parent === null || n.parent.children.indexOf(n) !== a) && this.currentItem.add(n, a);
    }
    let s = n.userData.name;
    i.isComputeStats && (s += " [ Compute ]"), g(n.data[0], s), g(n.data[1], r.cpu.toFixed(2)), g(n.data[2], i.gpuNotAvailable === true ? "-" : r.gpu.toFixed(2)), g(n.data[3], r.total.toFixed(2));
    const o = this.currentItem;
    this.currentItem = n;
    for (const a of i.children)
      this.resolveStats(t, a);
    this.currentItem = o, this.frameItems.set(i.cid, n);
  }
  updateGraph(t) {
    this.graph.addPoint("fps", t.fps), this.graph.update();
  }
  addNotInUse(t, i) {
    i.domElement.firstElementChild.classList.add("alert"), this.notInUse.set(t, {
      item: i,
      time: performance.now()
    }), this.updateNotInUse(t);
  }
  updateNotInUse(t) {
    const { item: i, time: r } = this.notInUse.get(t), n = performance.now(), o = 5 - Math.floor((n - r) / 1e3);
    if (o >= 0) {
      const a = "*".repeat(Math.max(0, o)), l = i.domElement.querySelector(".list-item-cell .value");
      g(l, i.userData.name + " (not in use) " + a);
    } else
      i.domElement.firstElementChild.classList.remove("alert"), i.parent.remove(i), this.notInUse.delete(t);
  }
  updateText(t, i) {
    const r = new Map(this.frameItems);
    this.frameItems.clear(), this.currentItem = this.frameStats;
    for (const n of i.children)
      this.resolveStats(t, n);
    for (const [n, s] of r)
      this.frameItems.has(n) || (this.addNotInUse(n, s), r.delete(n));
    for (const n of this.notInUse.keys())
      this.updateNotInUse(n);
    g("graph-fps-counter", t.fps.toFixed() + " FPS"), g(this.frameStats.data[1], i.cpu.toFixed(2)), g(this.frameStats.data[2], i.gpu.toFixed(2)), g(this.frameStats.data[3], i.total.toFixed(2)), g(this.miscellaneous.data[1], i.miscellaneous.toFixed(2)), g(this.miscellaneous.data[2], "-"), g(this.miscellaneous.data[3], i.miscellaneous.toFixed(2)), this.currentItem = null;
  }
}
class W extends b {
  constructor() {
    super("Console"), this.filters = { info: true, warn: true, error: true }, this.filterText = "", this.buildHeader(), this.logContainer = document.createElement("div"), this.logContainer.id = "console-log", this.content.appendChild(this.logContainer);
  }
  buildHeader() {
    const t = document.createElement("div");
    t.className = "console-header";
    const i = document.createElement("input");
    i.type = "text", i.className = "console-filter-input", i.placeholder = "Filter...", i.addEventListener("input", (n) => {
      this.filterText = n.target.value.toLowerCase(), this.applyFilters();
    });
    const r = document.createElement("div");
    r.className = "console-filters-group", Object.keys(this.filters).forEach((n) => {
      const s = document.createElement("label");
      s.className = "custom-checkbox", s.style.color = `var(--${n === "info" ? "text-primary" : "color-" + (n === "warn" ? "yellow" : "red")})`;
      const o = document.createElement("input");
      o.type = "checkbox", o.checked = this.filters[n], o.dataset.type = n;
      const a = document.createElement("span");
      a.className = "checkmark", s.appendChild(o), s.appendChild(a), s.append(n.charAt(0).toUpperCase() + n.slice(1)), r.appendChild(s);
    }), r.addEventListener("change", (n) => {
      const s = n.target.dataset.type;
      s in this.filters && (this.filters[s] = n.target.checked, this.applyFilters());
    }), t.appendChild(i), t.appendChild(r), this.content.appendChild(t);
  }
  applyFilters() {
    this.logContainer.querySelectorAll(".log-message").forEach((i) => {
      const r = i.dataset.type, n = i.dataset.rawText.toLowerCase(), s = this.filters[r], o = n.includes(this.filterText);
      i.classList.toggle("hidden", !(s && o));
    });
  }
  _getIcon(t, i) {
    let r;
    return i === "tip" ? r = "\u{1F4AD}" : i === "tsl" ? r = "\u2728" : i === "webgpurenderer" ? r = "\u{1F3A8}" : t === "warn" ? r = "\u26A0\uFE0F" : t === "error" ? r = "\u{1F534}" : t === "info" && (r = "\u2139\uFE0F"), r;
  }
  _formatMessage(t, i) {
    const r = document.createDocumentFragment(), n = i.match(/^([\w\.]+:\s)/);
    let s = i;
    if (n) {
      const a = n[0], l = a.slice(0, -2).split("."), c = (l.length > 1 ? l[l.length - 1] : l[0]) + ":", h = this._getIcon(t, c.split(":")[0].toLowerCase());
      r.appendChild(document.createTextNode(h + " "));
      const u = document.createElement("span");
      u.className = "log-prefix", u.textContent = c, r.appendChild(u), s = i.substring(a.length);
    }
    const o = s.split(/(".*?"|'.*?'|`.*?`)/g).map((a) => a.trim()).filter(Boolean);
    return o.forEach((a, l) => {
      if (/^("|'|`)/.test(a)) {
        const c = document.createElement("span");
        c.className = "log-code", c.textContent = a.slice(1, -1), r.appendChild(c);
      } else
        l > 0 && (a = " " + a), l < o.length - 1 && (a += " "), r.appendChild(document.createTextNode(a));
    }), r;
  }
  addMessage(t, i) {
    const r = document.createElement("div");
    r.className = `log-message ${t}`, r.dataset.type = t, r.dataset.rawText = i, r.appendChild(this._formatMessage(t, i));
    const n = this.filters[t], s = i.toLowerCase().includes(this.filterText);
    r.classList.toggle("hidden", !(n && s)), this.logContainer.appendChild(r), this.logContainer.scrollTop = this.logContainer.scrollHeight, this.logContainer.children.length > 200 && this.logContainer.removeChild(this.logContainer.firstChild);
  }
}
class f extends M {
  constructor() {
    super(), this.domElement = document.createElement("div"), this.domElement.className = "param-control", this._onChangeFunction = null, this.addEventListener("change", (t) => {
      requestAnimationFrame(() => {
        this._onChangeFunction && this._onChangeFunction(t.value);
      });
    });
  }
  setValue() {
    return this.dispatchChange(), this;
  }
  getValue() {
    return null;
  }
  dispatchChange() {
    this.dispatchEvent({ type: "change", value: this.getValue() });
  }
  onChange(t) {
    return this._onChangeFunction = t, this;
  }
}
class k extends f {
  constructor({ value: t = 0, step: i = 0.1, min: r = -1 / 0, max: n = 1 / 0 }) {
    super(), this.input = document.createElement("input"), this.input.type = "number", this.input.value = t, this.input.step = i, this.input.min = r, this.input.max = n, this.input.addEventListener("change", this._onChangeValue.bind(this)), this.domElement.appendChild(this.input), this.addDragHandler();
  }
  _onChangeValue() {
    const t = parseFloat(this.input.value), i = parseFloat(this.input.min), r = parseFloat(this.input.max);
    t > r ? this.input.value = r : t < i ? this.input.value = i : isNaN(t) && (this.input.value = i), this.dispatchChange();
  }
  addDragHandler() {
    let t = false, i, r;
    this.input.addEventListener("mousedown", (n) => {
      t = true, i = n.clientY, r = parseFloat(this.input.value), document.body.style.cursor = "ns-resize";
    }), document.addEventListener("mousemove", (n) => {
      if (t) {
        const s = i - n.clientY, o = parseFloat(this.input.step) || 1, a = parseFloat(this.input.min), l = parseFloat(this.input.max);
        let c = o;
        !isNaN(l) && isFinite(a) && (c = (l - a) / 100);
        const h = s * c;
        let u = r + h;
        u = Math.max(a, Math.min(u, l));
        const S = (String(o).split(".")[1] || []).length;
        this.input.value = u.toFixed(S), this.input.dispatchEvent(new Event("input")), this.dispatchChange();
      }
    }), document.addEventListener("mouseup", () => {
      t && (t = false, document.body.style.cursor = "default");
    });
  }
  getValue() {
    return parseFloat(this.input.value);
  }
}
class H extends f {
  constructor({ value: t = false }) {
    super();
    const i = document.createElement("label");
    i.className = "custom-checkbox";
    const r = document.createElement("input");
    r.type = "checkbox", r.checked = t, this.checkbox = r;
    const n = document.createElement("span");
    n.className = "checkmark", i.appendChild(r), i.appendChild(n), this.domElement.appendChild(i), r.addEventListener("change", () => {
      this.dispatchChange();
    });
  }
  getValue() {
    return this.checkbox.checked;
  }
}
class q extends f {
  constructor({ value: t = 0, min: i = 0, max: r = 1, step: n = 0.01 }) {
    super(), this.slider = document.createElement("input"), this.slider.type = "range", this.slider.min = i, this.slider.max = r, this.slider.step = n;
    const s = new k({ value: t, min: i, max: r, step: n });
    this.numberInput = s.input, this.numberInput.style.width = "60px", this.numberInput.style.flexShrink = "0", this.slider.value = t, this.domElement.append(this.slider, this.numberInput), this.slider.addEventListener("input", () => {
      this.numberInput.value = this.slider.value, this.dispatchChange();
    }), s.addEventListener("change", () => {
      this.slider.value = parseFloat(this.numberInput.value), this.dispatchChange();
    });
  }
  setValue(t) {
    return this.slider.value = t, this.numberInput.value = t, super.setValue(t);
  }
  getValue() {
    return parseFloat(this.slider.value);
  }
  step(t) {
    return this.slider.step = t, this.numberInput.step = t, this;
  }
}
class $ extends f {
  constructor({ options: t = [], value: i = "" }) {
    super();
    const r = document.createElement("select"), n = (s, o) => {
      const a = document.createElement("option");
      return a.value = s, a.textContent = s, o == i && (a.selected = true), r.appendChild(a), a;
    };
    Array.isArray(t) ? t.forEach((s) => n(s, s)) : Object.entries(t).forEach(([s, o]) => n(s, o)), this.domElement.appendChild(r), r.addEventListener("change", () => {
      this.dispatchChange();
    }), this.options = t, this.select = r;
  }
  getValue() {
    const t = this.options;
    return Array.isArray(t) ? t[this.select.selectedIndex] : t[this.select.value];
  }
}
class j extends f {
  constructor({ value: t = "#ffffff" }) {
    super();
    const i = document.createElement("input");
    i.type = "color", i.value = this._getColorHex(t), this.colorInput = i, this._value = t, i.addEventListener("input", () => {
      const r = i.value;
      this._value.isColor ? this._value.setHex(parseInt(r.slice(1), 16)) : this._value = r, this.dispatchChange();
    }), this.domElement.appendChild(i);
  }
  _getColorHex(t) {
    return t.isColor && (t = t.getHex()), typeof t == "number" ? t = `#${t.toString(16)}` : t[0] !== "#" && (t = "#" + t), t;
  }
  getValue() {
    let t = this._value;
    return typeof t == "string" && (t = parseInt(t.slice(1), 16)), t;
  }
}
class Y extends f {
  constructor({ text: t = "Button", value: i = () => {
  } }) {
    super();
    const r = document.createElement("button");
    r.textContent = t, r.onclick = i, this.domElement.appendChild(r);
  }
}
class w {
  constructor(t, i) {
    this.parameters = t, this.name = i, this.paramList = new m(i);
  }
  close() {
    return this.paramList.close(), this;
  }
  add(t, i, ...r) {
    const s = typeof t[i];
    let o = null;
    return typeof r[0] == "object" ? o = this.addSelect(t, i, r[0]) : s === "number" ? r.length >= 2 ? o = this.addSlider(t, i, ...r) : o = this.addNumber(t, i, ...r) : s === "boolean" ? o = this.addBoolean(t, i) : s === "function" && (o = this.addButton(t, i, ...r)), o;
  }
  _addParameter(t, i, r, n) {
    r.name = (s) => (n.data[0].textContent = s, r), r.listen = () => {
      const s = () => {
        const o = r.getValue(), a = t[i];
        o !== a && r.setValue(a), requestAnimationFrame(s);
      };
      return requestAnimationFrame(s), r;
    };
  }
  addFolder(t) {
    const i = new w(this.parameters, t);
    return this.paramList.add(i.paramList), i;
  }
  addBoolean(t, i) {
    const r = t[i], n = new H({ value: r });
    n.addEventListener("change", ({ value: l }) => {
      t[i] = l;
    });
    const s = p();
    s.textContent = i;
    const o = new m(s, n.domElement);
    this.paramList.add(o);
    const a = o.domElement.firstChild;
    return a.classList.add("actionable"), a.addEventListener("click", (l) => {
      if (l.target.closest("label"))
        return;
      const c = a.querySelector('input[type="checkbox"]');
      c && (c.checked = !c.checked, c.dispatchEvent(new Event("change")));
    }), this._addParameter(t, i, n, o), n;
  }
  addSelect(t, i, r) {
    const n = t[i], s = new $({ options: r, value: n });
    s.addEventListener("change", ({ value: c }) => {
      t[i] = c;
    });
    const o = p();
    o.textContent = i;
    const a = new m(o, s.domElement);
    return this.paramList.add(a), a.domElement.firstChild.classList.add("actionable"), this._addParameter(t, i, s, a), s;
  }
  addColor(t, i) {
    const r = t[i], n = new j({ value: r });
    n.addEventListener("change", ({ value: l }) => {
      t[i] = l;
    });
    const s = p();
    s.textContent = i;
    const o = new m(s, n.domElement);
    return this.paramList.add(o), o.domElement.firstChild.classList.add("actionable"), this._addParameter(t, i, n, o), n;
  }
  addSlider(t, i, r = 0, n = 1, s = 0.01) {
    const o = t[i], a = new q({ value: o, min: r, max: n, step: s });
    a.addEventListener("change", ({ value: u }) => {
      t[i] = u;
    });
    const l = p();
    l.textContent = i;
    const c = new m(l, a.domElement);
    return this.paramList.add(c), c.domElement.firstChild.classList.add("actionable"), this._addParameter(t, i, a, c), a;
  }
  addNumber(t, i, ...r) {
    const n = t[i], [s, o] = r, a = new k({ value: n, min: s, max: o });
    a.addEventListener("change", ({ value: u }) => {
      t[i] = u;
    });
    const l = p();
    l.textContent = i;
    const c = new m(l, a.domElement);
    return this.paramList.add(c), c.domElement.firstChild.classList.add("actionable"), this._addParameter(t, i, a, c), a;
  }
  addButton(t, i) {
    const r = t[i], n = new Y({ text: i, value: r });
    n.addEventListener("change", ({ value: a }) => {
      t[i] = a;
    });
    const s = new m(n.domElement);
    return s.itemRow.childNodes[0].style.gridColumn = "1 / -1", this.paramList.add(s), s.domElement.firstChild.classList.add("actionable"), n.name = (a) => (n.domElement.childNodes[0].textContent = a, n), n;
  }
}
class Z extends b {
  constructor() {
    super("Parameters");
    const t = new v("Property", "Value");
    t.domElement.classList.add("parameters"), t.setGridStyle(".5fr 1fr"), t.domElement.style.minWidth = "300px";
    const i = document.createElement("div");
    i.className = "list-scroll-wrapper", i.appendChild(t.domElement), this.content.appendChild(i), this.paramList = t;
  }
  createGroup(t) {
    const i = new w(this, t);
    return this.paramList.add(i.paramList), i;
  }
}
class X extends b {
  constructor() {
    super("Viewer");
    const t = new v("Viewer", "Name");
    t.setGridStyle("150px minmax(200px, 2fr)"), t.domElement.style.minWidth = "600px";
    const i = document.createElement("div");
    i.className = "list-scroll-wrapper", i.appendChild(t.domElement), this.content.appendChild(i);
    const r = new m("Nodes");
    t.add(r), this.itemLibrary = /* @__PURE__ */ new Map(), this.folderLibrary = /* @__PURE__ */ new Map(), this.currentDataList = [], this.nodeList = t, this.nodes = r;
  }
  getFolder(t) {
    let i = this.folderLibrary.get(t);
    return i === void 0 && (i = new m(t), this.folderLibrary.set(t, i), this.nodeList.add(i)), i;
  }
  addNodeItem(t) {
    let i = this.itemLibrary.get(t.id);
    if (i === void 0) {
      const r = t.name, n = t.canvasTarget.domElement;
      i = new m(n, r), i.itemRow.children[1].style["justify-content"] = "flex-start", this.itemLibrary.set(t.id, i);
    }
    return i;
  }
  update(t, i) {
    if (!this.isActive)
      return;
    const r = [...this.currentDataList];
    for (const s of r)
      if (this.itemLibrary.has(s.id) && i.indexOf(s) === -1) {
        const o = this.itemLibrary.get(s.id), a = o.parent;
        a.remove(o), this.folderLibrary.has(a.data[0]) && a.children.length === 0 && (a.parent.remove(a), this.folderLibrary.delete(a.data[0])), this.itemLibrary.delete(s.id);
      }
    const n = {};
    for (const s of i) {
      const o = this.addNodeItem(s), a = t.getCanvasTarget(), l = s.path;
      if (l) {
        const h = this.getFolder(l);
        n[l] === void 0 && (n[l] = 0), (h.parent === null || o.parent !== h || h.children.indexOf(o) !== n[l]) && h.add(o), n[l]++;
      } else
        o.parent || this.nodes.add(o);
      this.currentDataList = i;
      const c = C.resetRendererState(t);
      t.toneMapping = y, t.outputColorSpace = L, t.setCanvasTarget(s.canvasTarget), s.quad.render(t), t.setCanvasTarget(a), C.restoreRendererState(t, c);
    }
  }
}
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
e.BRDF_GGX;
e.BRDF_Lambert;
e.BasicPointShadowFilter;
e.BasicShadowFilter;
e.Break;
e.Const;
e.Continue;
e.DFGApprox;
e.D_GGX;
e.Discard;
e.EPSILON;
e.F_Schlick;
e.Fn;
e.INFINITY;
e.If;
e.Loop;
e.NodeAccess;
e.NodeShaderStage;
e.NodeType;
e.NodeUpdateType;
e.PCFShadowFilter;
e.PCFSoftShadowFilter;
e.PI;
e.PI2;
e.TWO_PI;
e.HALF_PI;
e.PointShadowFilter;
e.Return;
e.Schlick_to_F0;
e.ScriptableNodeResources;
e.ShaderNode;
e.Stack;
e.Switch;
e.TBNViewMatrix;
e.VSMShadowFilter;
e.V_GGX_SmithCorrelated;
e.Var;
e.VarIntent;
e.abs;
e.acesFilmicToneMapping;
e.acos;
e.add;
e.addMethodChaining;
e.addNodeElement;
e.agxToneMapping;
e.all;
e.alphaT;
e.and;
e.anisotropy;
e.anisotropyB;
e.anisotropyT;
e.any;
e.append;
e.array;
e.arrayBuffer;
e.asin;
e.assign;
e.atan;
e.atan2;
e.atomicAdd;
e.atomicAnd;
e.atomicFunc;
e.atomicLoad;
e.atomicMax;
e.atomicMin;
e.atomicOr;
e.atomicStore;
e.atomicSub;
e.atomicXor;
e.attenuationColor;
e.attenuationDistance;
e.attribute;
e.attributeArray;
e.backgroundBlurriness;
e.backgroundIntensity;
e.backgroundRotation;
e.batch;
e.bentNormalView;
e.billboarding;
e.bitAnd;
e.bitNot;
e.bitOr;
e.bitXor;
e.bitangentGeometry;
e.bitangentLocal;
e.bitangentView;
e.bitangentWorld;
e.bitcast;
e.blendBurn;
e.blendColor;
e.blendDodge;
e.blendOverlay;
e.blendScreen;
e.blur;
e.bool;
e.buffer;
e.bufferAttribute;
e.bumpMap;
e.burn;
e.builtin;
e.bvec2;
e.bvec3;
e.bvec4;
e.bypass;
e.cache;
e.call;
e.cameraFar;
e.cameraIndex;
e.cameraNear;
e.cameraNormalMatrix;
e.cameraPosition;
e.cameraProjectionMatrix;
e.cameraProjectionMatrixInverse;
e.cameraViewMatrix;
e.cameraViewport;
e.cameraWorldMatrix;
e.cbrt;
e.cdl;
e.ceil;
e.checker;
e.cineonToneMapping;
e.clamp;
e.clearcoat;
e.clearcoatNormalView;
e.clearcoatRoughness;
e.code;
e.color;
e.colorSpaceToWorking;
e.colorToDirection;
e.compute;
e.computeKernel;
e.computeSkinning;
e.context;
e.convert;
e.convertColorSpace;
e.convertToTexture;
e.cos;
e.cross;
e.cubeTexture;
e.cubeTextureBase;
e.cubeToUV;
e.dFdx;
e.dFdy;
e.dashSize;
e.debug;
e.decrement;
e.decrementBefore;
e.defaultBuildStages;
e.defaultShaderStages;
e.defined;
e.degrees;
e.deltaTime;
e.densityFog;
e.densityFogFactor;
e.depth;
e.depthPass;
e.determinant;
e.difference;
e.diffuseColor;
e.directPointLight;
e.directionToColor;
e.directionToFaceDirection;
e.dispersion;
e.distance;
e.div;
e.dodge;
e.dot;
e.drawIndex;
e.dynamicBufferAttribute;
e.element;
e.emissive;
e.equal;
e.equals;
e.equirectUV;
e.exp;
e.exp2;
e.expression;
e.faceDirection;
e.faceForward;
e.faceforward;
e.float;
e.floatBitsToInt;
e.floatBitsToUint;
e.floor;
e.fog;
e.fract;
e.frameGroup;
e.frameId;
e.frontFacing;
e.fwidth;
e.gain;
e.gapSize;
e.getConstNodeType;
e.getCurrentStack;
e.getDirection;
e.getDistanceAttenuation;
e.getGeometryRoughness;
e.getNormalFromDepth;
e.interleavedGradientNoise;
e.getParallaxCorrectNormal;
e.getRoughness;
e.getScreenPosition;
e.getShIrradianceAt;
e.getShadowMaterial;
e.getShadowRenderObjectFunction;
e.getTextureIndex;
e.getViewPosition;
e.globalId;
e.glsl;
e.glslFn;
e.grayscale;
e.greaterThan;
e.greaterThanEqual;
e.hash;
e.highpModelNormalViewMatrix;
e.highpModelViewMatrix;
e.hue;
e.increment;
e.incrementBefore;
e.instance;
e.instanceIndex;
e.instancedArray;
e.instancedBufferAttribute;
e.instancedDynamicBufferAttribute;
e.instancedMesh;
e.int;
e.intBitsToFloat;
e.inverse;
e.inverseSqrt;
e.inversesqrt;
e.invocationLocalIndex;
e.invocationSubgroupIndex;
e.ior;
e.iridescence;
e.iridescenceIOR;
e.iridescenceThickness;
e.ivec2;
e.ivec3;
e.ivec4;
e.js;
e.label;
e.length;
e.lengthSq;
e.lessThan;
e.lessThanEqual;
e.lightPosition;
e.lightProjectionUV;
e.lightShadowMatrix;
e.lightTargetDirection;
e.lightTargetPosition;
e.lightViewPosition;
e.lightingContext;
e.lights;
e.linearDepth;
e.linearToneMapping;
e.localId;
e.log;
e.log2;
e.logarithmicDepthToViewZ;
e.luminance;
e.mat2;
e.mat3;
e.mat4;
e.matcapUV;
e.materialAO;
e.materialAlphaTest;
e.materialAnisotropy;
e.materialAnisotropyVector;
e.materialAttenuationColor;
e.materialAttenuationDistance;
e.materialClearcoat;
e.materialClearcoatNormal;
e.materialClearcoatRoughness;
e.materialColor;
e.materialDispersion;
e.materialEmissive;
e.materialEnvIntensity;
e.materialEnvRotation;
e.materialIOR;
e.materialIridescence;
e.materialIridescenceIOR;
e.materialIridescenceThickness;
e.materialLightMap;
e.materialLineDashOffset;
e.materialLineDashSize;
e.materialLineGapSize;
e.materialLineScale;
e.materialLineWidth;
e.materialMetalness;
e.materialNormal;
e.materialOpacity;
e.materialPointSize;
e.materialReference;
e.materialReflectivity;
e.materialRefractionRatio;
e.materialRotation;
e.materialRoughness;
e.materialSheen;
e.materialSheenRoughness;
e.materialShininess;
e.materialSpecular;
e.materialSpecularColor;
e.materialSpecularIntensity;
e.materialSpecularStrength;
e.materialThickness;
e.materialTransmission;
e.max;
e.maxMipLevel;
e.mediumpModelViewMatrix;
e.metalness;
e.min;
e.mix;
e.mixElement;
e.mod;
e.modInt;
e.modelDirection;
e.modelNormalMatrix;
e.modelPosition;
e.modelRadius;
e.modelScale;
e.modelViewMatrix;
e.modelViewPosition;
e.modelViewProjection;
e.modelWorldMatrix;
e.modelWorldMatrixInverse;
e.morphReference;
e.mrt;
e.mul;
e.mx_aastep;
e.mx_add;
e.mx_atan2;
e.mx_cell_noise_float;
e.mx_contrast;
e.mx_divide;
e.mx_fractal_noise_float;
e.mx_fractal_noise_vec2;
e.mx_fractal_noise_vec3;
e.mx_fractal_noise_vec4;
e.mx_frame;
e.mx_heighttonormal;
e.mx_hsvtorgb;
e.mx_ifequal;
e.mx_ifgreater;
e.mx_ifgreatereq;
e.mx_invert;
e.mx_modulo;
e.mx_multiply;
e.mx_noise_float;
e.mx_noise_vec3;
e.mx_noise_vec4;
e.mx_place2d;
e.mx_power;
e.mx_ramp4;
e.mx_ramplr;
e.mx_ramptb;
e.mx_rgbtohsv;
e.mx_rotate2d;
e.mx_rotate3d;
e.mx_safepower;
e.mx_separate;
e.mx_splitlr;
e.mx_splittb;
e.mx_srgb_texture_to_lin_rec709;
e.mx_subtract;
e.mx_timer;
e.mx_transform_uv;
e.mx_unifiednoise2d;
e.mx_unifiednoise3d;
e.mx_worley_noise_float;
e.mx_worley_noise_vec2;
e.mx_worley_noise_vec3;
e.negate;
e.neutralToneMapping;
e.nodeArray;
e.nodeImmutable;
e.nodeObject;
e.nodeObjectIntent;
e.nodeObjects;
e.nodeProxy;
e.nodeProxyIntent;
e.normalFlat;
e.normalGeometry;
e.normalLocal;
e.normalMap;
e.normalView;
e.normalViewGeometry;
e.normalWorld;
e.normalWorldGeometry;
e.normalize;
e.not;
e.notEqual;
e.numWorkgroups;
e.objectDirection;
e.objectGroup;
e.objectPosition;
e.objectRadius;
e.objectScale;
e.objectViewPosition;
e.objectWorldMatrix;
e.OnBeforeObjectUpdate;
e.OnBeforeMaterialUpdate;
e.OnObjectUpdate;
e.OnMaterialUpdate;
e.oneMinus;
e.or;
e.orthographicDepthToViewZ;
e.oscSawtooth;
e.oscSine;
e.oscSquare;
e.oscTriangle;
e.output;
e.outputStruct;
e.overlay;
e.overloadingFn;
e.parabola;
e.parallaxDirection;
e.parallaxUV;
e.parameter;
e.pass;
e.passTexture;
e.pcurve;
e.perspectiveDepthToViewZ;
e.pmremTexture;
e.pointShadow;
e.pointUV;
e.pointWidth;
e.positionGeometry;
e.positionLocal;
e.positionPrevious;
e.positionView;
e.positionViewDirection;
e.positionWorld;
e.positionWorldDirection;
e.posterize;
e.pow;
e.pow2;
e.pow3;
e.pow4;
e.premultiplyAlpha;
e.property;
e.radians;
e.rand;
e.range;
e.rangeFog;
e.rangeFogFactor;
e.reciprocal;
e.reference;
e.referenceBuffer;
e.reflect;
e.reflectVector;
e.reflectView;
e.reflector;
e.refract;
e.refractVector;
e.refractView;
e.reinhardToneMapping;
e.remap;
e.remapClamp;
e.renderGroup;
const Q = e.renderOutput;
e.rendererReference;
e.rotate;
e.rotateUV;
e.roughness;
e.round;
e.rtt;
e.sRGBTransferEOTF;
e.sRGBTransferOETF;
e.sample;
e.sampler;
e.samplerComparison;
e.saturate;
e.saturation;
e.screen;
e.screenCoordinate;
e.screenDPR;
e.screenSize;
e.screenUV;
e.scriptable;
e.scriptableValue;
e.select;
e.setCurrentStack;
e.setName;
e.shaderStages;
e.shadow;
e.shadowPositionWorld;
e.shapeCircle;
e.sharedUniformGroup;
e.sheen;
e.sheenRoughness;
e.shiftLeft;
e.shiftRight;
e.shininess;
e.sign;
e.sin;
e.sinc;
e.skinning;
e.smoothstep;
e.smoothstepElement;
e.specularColor;
e.specularF90;
e.spherizeUV;
e.split;
e.spritesheetUV;
e.sqrt;
e.stack;
e.step;
e.stepElement;
e.storage;
e.storageBarrier;
e.storageObject;
e.storageTexture;
e.string;
e.struct;
e.sub;
e.subgroupAdd;
e.subgroupAll;
e.subgroupAnd;
e.subgroupAny;
e.subgroupBallot;
e.subgroupBroadcast;
e.subgroupBroadcastFirst;
e.subBuild;
e.subgroupElect;
e.subgroupExclusiveAdd;
e.subgroupExclusiveMul;
e.subgroupInclusiveAdd;
e.subgroupInclusiveMul;
e.subgroupIndex;
e.subgroupMax;
e.subgroupMin;
e.subgroupMul;
e.subgroupOr;
e.subgroupShuffle;
e.subgroupShuffleDown;
e.subgroupShuffleUp;
e.subgroupShuffleXor;
e.subgroupSize;
e.subgroupXor;
e.tan;
e.tangentGeometry;
e.tangentLocal;
e.tangentView;
e.tangentWorld;
e.texture;
e.texture3D;
e.textureBarrier;
e.textureBicubic;
e.textureBicubicLevel;
e.textureCubeUV;
e.textureLoad;
e.textureSize;
e.textureLevel;
e.textureStore;
e.thickness;
e.time;
e.toneMapping;
e.toneMappingExposure;
e.toonOutlinePass;
e.transformDirection;
e.transformNormal;
e.transformNormalToView;
e.transformedClearcoatNormalView;
e.transformedNormalView;
e.transformedNormalWorld;
e.transmission;
e.transpose;
e.triNoise3D;
e.triplanarTexture;
e.triplanarTextures;
e.trunc;
e.uint;
e.uintBitsToFloat;
e.uniform;
e.uniformArray;
e.uniformCubeTexture;
e.uniformGroup;
e.uniformFlow;
e.uniformTexture;
e.unpremultiplyAlpha;
e.userData;
e.uv;
e.uvec2;
e.uvec3;
e.uvec4;
e.varying;
e.varyingProperty;
e.vec2;
const K = e.vec3, J = e.vec4;
e.vectorComponents;
e.velocity;
e.vertexColor;
e.vertexIndex;
e.vertexStage;
e.vibrance;
e.viewZToLogarithmicDepth;
e.viewZToOrthographicDepth;
e.viewZToPerspectiveDepth;
e.viewport;
e.viewportCoordinate;
e.viewportDepthTexture;
e.viewportLinearDepth;
e.viewportMipTexture;
e.viewportResolution;
e.viewportSafeUV;
e.viewportSharedTexture;
e.viewportSize;
e.viewportTexture;
e.viewportUV;
e.wgsl;
e.wgslFn;
e.workgroupArray;
e.workgroupBarrier;
e.workgroupId;
e.workingToColorSpace;
e.xor;
class ie extends B {
  constructor() {
    super();
    const t = new D(), i = new Z();
    i.hide(), t.addTab(i);
    const r = new X();
    r.hide(), t.addTab(r);
    const n = new G();
    t.addTab(n);
    const s = new W();
    t.addTab(s), t.setActiveTab(n.id), this.statsData = /* @__PURE__ */ new Map(), this.canvasNodes = /* @__PURE__ */ new Map(), this.profiler = t, this.performance = n, this.console = s, this.parameters = i, this.viewer = r, this.once = {}, this.displayCycle = {
      text: {
        needsUpdate: false,
        duration: 0.25,
        time: 0
      },
      graph: {
        needsUpdate: false,
        duration: 0.02,
        time: 0
      }
    };
  }
  get domElement() {
    return this.profiler.domElement;
  }
  resolveConsoleOnce(t, i) {
    const r = t + i;
    this.once[r] !== true && (this.resolveConsole(t, i), this.once[r] = true);
  }
  resolveConsole(t, i) {
    switch (t) {
      case "log":
        this.console.addMessage("info", i), console.log(i);
        break;
      case "warn":
        this.console.addMessage("warn", i), console.warn(i);
        break;
      case "error":
        this.console.addMessage("error", i), console.error(i);
        break;
    }
  }
  init() {
    const t = this.getRenderer();
    let i = `THREE.WebGPURenderer: ${N} [ "`;
    t.backend.isWebGPUBackend ? i += "WebGPU" : t.backend.isWebGLBackend && (i += "WebGL2"), i += '" ]', this.console.addMessage("info", i), t.inspector.domElement.parentElement === null && t.domElement.parentElement !== null && t.domElement.parentElement.appendChild(t.inspector.domElement);
  }
  setRenderer(t) {
    return super.setRenderer(t), t !== null && (I(this.resolveConsole.bind(this)), this.isAvailable && (t.backend.trackTimestamp = true, t.init().then(() => {
      t.hasFeature("timestamp-query") !== true && this.console.addMessage("error", "THREE.Inspector: GPU Timestamp Queries not available.");
    }))), this;
  }
  createParameters(t) {
    return this.parameters.isVisible === false && (this.parameters.show(), this.profiler.setActiveTab(this.parameters.id)), this.parameters.createGroup(t);
  }
  getStatsData(t) {
    let i = this.statsData.get(t);
    return i === void 0 && (i = {}, this.statsData.set(t, i)), i;
  }
  resolveStats(t) {
    const i = this.getStatsData(t.cid);
    i.initialized !== true && (i.cpu = t.cpu, i.gpu = t.gpu, i.stats = [], i.initialized = true), i.stats.length > this.maxFrames && i.stats.shift(), i.stats.push(t), i.cpu = this.getAverageDeltaTime(i, "cpu"), i.gpu = this.getAverageDeltaTime(i, "gpu"), i.total = i.cpu + i.gpu;
    for (const r of t.children) {
      this.resolveStats(r);
      const n = this.getStatsData(r.cid);
      i.cpu += n.cpu, i.gpu += n.gpu, i.total += n.total;
    }
  }
  getCanvasDataByNode(t) {
    let i = this.canvasNodes.get(t);
    if (i === void 0) {
      const r = this.getRenderer(), n = document.createElement("canvas"), s = new F(n);
      s.setPixelRatio(window.devicePixelRatio), s.setSize(140, 140);
      const o = t.id, { path: a, name: l } = U(O(t.getName() || "(unnamed)"));
      let c = J(K(t), 1);
      c = Q(c, y, r.outputColorSpace), c = c.context({ inspector: true });
      const h = new _();
      h.outputNode = c;
      const u = new R(h);
      u.name = "Viewer - " + l, i = {
        id: o,
        name: l,
        path: a,
        node: t,
        quad: u,
        canvasTarget: s,
        material: h
      }, this.canvasNodes.set(t, i);
    }
    return i;
  }
  resolveViewer() {
    const t = this.currentNodes, i = this.getRenderer();
    if (t.length === 0)
      return;
    if (!i.backend.isWebGPUBackend) {
      this.resolveConsoleOnce("warn", "Inspector: Viewer is only available with WebGPU.");
      return;
    }
    this.viewer.isVisible || this.viewer.show();
    const r = t.map((n) => this.getCanvasDataByNode(n));
    this.viewer.update(i, r);
  }
  getAverageDeltaTime(t, i, r = this.fps) {
    const n = t.stats;
    let s = 0, o = 0;
    for (let a = n.length - 1; a >= 0 && o < r; a--) {
      const c = n[a][i];
      c > 0 && (s += c, o++);
    }
    return o > 0 ? s / o : 0;
  }
  resolveFrame(t) {
    const i = this.getFrameById(t.frameId + 1);
    if (i) {
      t.cpu = 0, t.gpu = 0, t.total = 0;
      for (const r of t.children) {
        this.resolveStats(r);
        const n = this.getStatsData(r.cid);
        t.cpu += n.cpu, t.gpu += n.gpu, t.total += n.total;
      }
      t.deltaTime = i.startTime - t.startTime, t.miscellaneous = t.deltaTime - t.total, t.miscellaneous < 0 && (t.miscellaneous = 0), this.updateCycle(this.displayCycle.text), this.updateCycle(this.displayCycle.graph), this.displayCycle.text.needsUpdate && (g("fps-counter", this.fps.toFixed()), this.performance.updateText(this, t)), this.displayCycle.graph.needsUpdate && this.performance.updateGraph(this, t), this.displayCycle.text.needsUpdate = false, this.displayCycle.graph.needsUpdate = false;
    }
  }
  updateCycle(t) {
    t.time += this.nodeFrame.deltaTime, t.time >= t.duration && (t.needsUpdate = true, t.time = 0);
  }
}
export {
  ie as Inspector
};
