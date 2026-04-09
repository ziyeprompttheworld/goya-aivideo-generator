/**
 * Kerr-Newman Black Hole Shader Logic
 * Based on the physically-based ray-tracing renderer for Kerr-Newman spacetime.
 */

export const blackHoleVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackHoleFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

#define PI 3.14159265358979323846
#define MAX_STEPS 80
#define G 1.0
#define M 1.0

// [克尔-纽曼物理常数 - 针对电影感微调]
float spin = 0.99; // 自旋系数 (电影效果通常接近极值)
float charge = 0.05; 

varying vec2 vUv;

// 高性能伪随机函数
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 模拟多普勒偏移与吸积盘不对称背景
vec3 getAccretionDiskColor(float r, float angle, float h) {
    // 基础吸积盘颜色 (橙红到明黄)
    float doppler = 1.0 + (sin(angle) * 0.4); // 旋转造成的一侧偏亮
    float temperature = smoothstep(1.5, 4.0, r);
    vec3 col = mix(vec3(1.0, 0.4, 0.05), vec3(1.0, 0.9, 0.4), doppler * temperature);
    
    // 增加流体纹理
    float density = sin(r * 20.0 - iTime * 4.0 + angle * 5.0) * 0.5 + 0.5;
    return col * density * doppler * (0.05 / (abs(h) + 0.05));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
    
    // 相机轨迹：电影俯视偏角
    vec3 ro = vec3(0.0, 2.0, -10.0);
    vec3 rd = normalize(vec3(uv, 1.8));

    // 鼠标交互控制
    float mx = (iMouse.x / iResolution.x - 0.5) * 4.0;
    float my = (iMouse.y / iResolution.y - 0.5) * 2.0;
    ro.x += mx;
    ro.y += my;
    rd.yz *= mat2(cos(my*0.1), -sin(my*0.1), sin(my*0.1), cos(my*0.1));
    rd.xz *= mat2(cos(mx*0.1), -sin(mx*0.1), sin(mx*0.1), cos(mx*0.1));

    vec3 finalCol = vec3(0.0);
    float t = 0.0;
    
    // 引力场递补追踪
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float r = length(p);
        
        // --- 核心 GR 渲染逻辑 ---
        // 光线在该坐标点的偏转量 (引力加速度)
        float invR3 = 1.0 / (r * r * r);
        vec3 gravityDir = -p * 2.5 * invR3;
        rd = normalize(rd + gravityDir * 0.3); // 步进式弯曲

        // 事件视界检查 (Event Horizon)
        float rs = M + sqrt(M*M - spin*spin - charge*charge);
        if (r < rs) {
            finalCol = vec3(0.0);
            break;
        }

        // 穿透平面：吸积盘 (Accretion Disk) 交叉
        if (abs(p.y) < 0.15 && r > rs * 1.5 && r < 8.0) {
            float angle = atan(p.z, p.x);
            vec3 diskCol = getAccretionDiskColor(r, angle, p.y);
            finalCol += diskCol * 0.12; 
        }

        t += 0.25;
        if (t > 25.0) break;
    }

    // --- 后效处理 ---
    // 星空背景 (具有引力透镜畸变的星空)
    if (length(finalCol) < 0.1) {
        float stars = pow(hash(rd.xy + rd.z), 30.0);
        finalCol += stars * 0.5 * vec3(0.9, 0.95, 1.0);
    }

    // 增加视界边缘的强光晕 (Atmospheric Bloom)
    float horizonGlow = 0.02 / (length(uv) - 0.15);
    finalCol += vec3(1.0, 0.5, 0.1) * max(0.0, horizonGlow) * 0.1;

    // ACES Filmic Tone Mapping
    finalCol = finalCol * (2.51 * finalCol + 0.03) / (finalCol * (2.43 * finalCol + 0.59) + 0.14);
    
    fragColor = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
}

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`;
