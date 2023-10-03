
#version 410

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 fragPosWorld;
in vec2 texCoord;

out vec4 colorOut;

uniform vec4 albedo;
uniform float specularExponent;
uniform float specularIntensity;

uniform int lightingMode;
uniform vec3 lightPosWorld;
uniform float lightIntensity;

void main()
{
	vec3 lightDir = normalize(lightPosWorld - fragPosWorld);
	vec3 reflectDir = lightDir - 2*(dot(lightDir, normalize(worldNorm))) * normalize(worldNorm);
	vec3 viewDir = normalize(fragPosWorld - cameraPos.xyz);
	viewDir *= -1;
	vec3 halfwayVec = normalize(lightDir) + normalize(viewDir);
	halfwayVec = normalize(halfwayVec);
	float lightDistance = length(lightPosWorld - fragPosWorld);



	colorOut = albedo;

	if(lightingMode == 0) {
		// Render with original Phong lighting model
		// I = KI(diffuse) * light•normal + KI(specular) * (reflected•view)^SpecTerm
		// --- Your Code Here ---
		colorOut = albedo * clamp(dot(lightDir, normalize(worldNorm)), 0, 1) + 
					specularIntensity * pow(clamp(dot(-viewDir, reflectDir), 0, 1), specularExponent);
	} else if(lightingMode == 1) {
		// Render with Blinn-Phong
		// Replace viewDir with halfwayVector in specular term - remember to increase Specular Exponent!
		// --- Your Code Here ---
		colorOut = albedo * clamp(dot(lightDir, normalize(worldNorm)), 0, 1) + 
					specularIntensity * pow(clamp(dot(halfwayVec, normalize(worldNorm)), 0, 1), specularExponent * 2);
	} else if(lightingMode == 2) {
		// Render with Modified Blinn-Phong
		// Similar to Blinn-Phong, but the L•N term is now multiplied through for Diffuse AND Specular, instead of just Diffuse
		// --- Your Code Here ---
		colorOut = clamp(dot(lightDir, normalize(worldNorm)), 0, 1) *
					(albedo + specularIntensity * pow(clamp(dot(halfwayVec, normalize(worldNorm)), 0, 1), specularExponent * 2));
	} else if(lightingMode == 3) {
		// Render with Modified Blinn-Phong, Normalized
		// multiply the Specular term by the normalization factor, (Exp + 8)/8
		// --- Your Code Here ---	
		float normFactor = (specularExponent + 8)/8;
		colorOut = clamp(dot(lightDir, normalize(worldNorm)), 0, 1) *
					(albedo + specularIntensity * normFactor * pow(clamp(dot(halfwayVec, normalize(worldNorm)), 0, 1), specularExponent * 2));
	}

	// final pass to add lighting
	colorOut *= lightIntensity;
	colorOut /= (lightDistance * lightDistance);
}

