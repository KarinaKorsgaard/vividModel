// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// edited for own use Jonas Fehr

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iGlobalTime;

uniform float para1;
uniform float para2;
uniform float para3;
uniform float alpha;

uniform bool u_bool;
uniform vec3 u_color;

uniform sampler2D mask;

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
    
    
    vec2 st;
    
    if(u_bool)st= gl_FragCoord.yx/iResolution.xy;
    else st= gl_FragCoord.xy/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;

    vec2 grid = vec2(para2*100.,para3*100.);
    //vec2 grid = vec2(100.,200.);
    st *= grid;
    vec4 alphaMask = texture2D(mask,gl_FragCoord.xy/iResolution.xy);
    if(alphaMask.w>0.5){
        vec2 ipos = floor(st);  // integer
        vec2 fpos = fract(st);  // fraction
        
        vec2 vel = vec2(iGlobalTime*.1*max(grid.x,grid.y)); // time
        vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction
        
        // Assign a random value base on the integer coord
        vec2 offset = vec2(0.1,0.);
        
        // vec3 color = vec3(0.);
        // color.r = pattern(st+offset,vel,0.2+1.0-para1);
        // color.g = pattern(st,vel,0.2+1.0-para1);
        // color.b = pattern(st-offset,vel,0.2+1.0-para1);
        
        float n = pattern(st,vel,0.2+1.0-para1);
        
        // Margins
        // color *= step(0.2,fpos.y);
        
        vec3 color = u_color;
        
        float a = 1.0;
        n = 1.0-n;
        a = n;
        
        color = n * color;
        gl_FragColor = vec4(color, a*alpha);
        
    }
    else gl_FragColor = vec4(0.);
}