// managers/KeyboardControls.ts
import * as THREE from "three";
export class KeyboardControls {
    constructor(camera, canvas, options = {}) {
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "flySpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sprintMultiplier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keybinds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pressedKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "isRightMouseDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "orbitControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Movement vectors
        Object.defineProperty(this, "velocity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new THREE.Vector3()
        });
        Object.defineProperty(this, "direction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new THREE.Vector3()
        });
        Object.defineProperty(this, "onKeyDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                if (!this.enabled || !this.isRightMouseDown)
                    return;
                const key = event.key.toLowerCase();
                this.pressedKeys.add(key);
                // Prevent default for movement keys
                if (Object.values(this.keybinds).some((k) => k.toLowerCase() === key || k === event.key)) {
                    event.preventDefault();
                }
            }
        });
        Object.defineProperty(this, "onKeyUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                const key = event.key.toLowerCase();
                this.pressedKeys.delete(key);
            }
        });
        Object.defineProperty(this, "onMouseDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                if (event.button === 2) {
                    // Right mouse button
                    this.isRightMouseDown = true;
                }
            }
        });
        Object.defineProperty(this, "onMouseUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                if (event.button === 2) {
                    // Right mouse button
                    this.isRightMouseDown = false;
                    this.pressedKeys.clear(); // Clear all keys when releasing right mouse
                }
            }
        });
        Object.defineProperty(this, "onContextMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (event) => {
                // Prevent context menu when right-clicking on canvas
                event.preventDefault();
            }
        });
        Object.defineProperty(this, "onBlur", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                // Clear all pressed keys when window loses focus
                this.pressedKeys.clear();
                this.isRightMouseDown = false;
            }
        });
        this.camera = camera;
        this.canvas = canvas;
        this.enabled = options.enabled ?? true;
        this.flySpeed = options.flySpeed ?? 5.0;
        this.sprintMultiplier = options.sprintMultiplier ?? 2.5;
        this.keybinds = {
            forward: options.keybinds?.forward ?? "w",
            backward: options.keybinds?.backward ?? "s",
            left: options.keybinds?.left ?? "a",
            right: options.keybinds?.right ?? "d",
            up: options.keybinds?.up ?? " ",
            down: options.keybinds?.down ?? "Shift",
            sprint: options.keybinds?.sprint ?? "Shift",
        };
        this.bindEvents();
    }
    /**
     * Set the orbit controls reference to enable/disable them during keyboard movement
     */
    setOrbitControls(controls) {
        this.orbitControls = controls;
    }
    /**
     * Update fly speed at runtime
     */
    setFlySpeed(speed) {
        this.flySpeed = speed;
    }
    /**
     * Get current fly speed
     */
    getFlySpeed() {
        return this.flySpeed;
    }
    /**
     * Update sprint multiplier at runtime
     */
    setSprintMultiplier(multiplier) {
        this.sprintMultiplier = multiplier;
    }
    /**
     * Enable or disable keyboard controls
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * Check if keyboard controls are enabled
     */
    isEnabled() {
        return this.enabled;
    }
    bindEvents() {
        // Keyboard events
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        // Mouse events for right-click detection
        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mouseup", this.onMouseUp);
        this.canvas.addEventListener("contextmenu", this.onContextMenu);
        // Handle focus loss
        window.addEventListener("blur", this.onBlur);
    }
    /**
     * Check if a specific key is pressed
     */
    isKeyPressed(keybind) {
        const key = keybind.toLowerCase();
        return this.pressedKeys.has(key) || this.pressedKeys.has(keybind);
    }
    /**
     * Update camera position based on keyboard input
     * Should be called every frame with deltaTime
     */
    update(deltaTime) {
        if (!this.enabled || !this.isRightMouseDown || this.pressedKeys.size === 0) {
            return;
        }
        // Calculate movement direction
        this.direction.set(0, 0, 0);
        // Forward/Backward (relative to camera direction)
        if (this.isKeyPressed(this.keybinds.forward)) {
            this.direction.z -= 1;
        }
        if (this.isKeyPressed(this.keybinds.backward)) {
            this.direction.z += 1;
        }
        // Left/Right (strafe)
        if (this.isKeyPressed(this.keybinds.left)) {
            this.direction.x -= 1;
        }
        if (this.isKeyPressed(this.keybinds.right)) {
            this.direction.x += 1;
        }
        // Up/Down (world space)
        if (this.isKeyPressed(this.keybinds.up)) {
            this.direction.y += 1;
        }
        if (this.isKeyPressed(this.keybinds.down)) {
            this.direction.y -= 1;
        }
        // Normalize direction to prevent faster diagonal movement
        if (this.direction.length() > 0) {
            this.direction.normalize();
        }
        // Apply sprint multiplier
        let speed = this.flySpeed;
        if (this.isKeyPressed(this.keybinds.sprint)) {
            speed *= this.sprintMultiplier;
        }
        // Calculate velocity
        this.velocity.copy(this.direction).multiplyScalar(speed * deltaTime);
        // Transform velocity to camera space (for forward/back/left/right)
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        // Create camera-relative coordinate system
        const forward = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        // Apply movement in camera space
        const movement = new THREE.Vector3();
        movement.addScaledVector(forward, -this.velocity.z); // Forward/backward
        movement.addScaledVector(right, this.velocity.x); // Left/right
        movement.y += this.velocity.y; // Up/down in world space
        // Update camera position
        this.camera.position.add(movement);
        // Update orbit controls target if available
        if (this.orbitControls) {
            this.orbitControls.target.add(movement);
            this.orbitControls.update();
        }
    }
    /**
     * Clean up event listeners
     */
    dispose() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("contextmenu", this.onContextMenu);
        window.removeEventListener("blur", this.onBlur);
        this.pressedKeys.clear();
    }
}
