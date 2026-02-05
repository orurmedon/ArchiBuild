#!/usr/bin/env node

/**
 * Script to download official cloud provider logos
 * Downloads AWS, Azure, GCP, and Kubernetes icons
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '../public/logos');

// Ensure directories exist
const providers = ['aws', 'azure', 'gcp', 'kubernetes', 'generic'];
providers.forEach(provider => {
    const dir = path.join(LOGOS_DIR, provider);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Use simple-icons for now (already installed)
// We'll convert simple-icons to SVG files for better performance

const simpleIcons = require('simple-icons');

function iconToSVG(icon) {
    return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>${icon.title}</title>
  <path fill="#${icon.hex}" d="${icon.path}"/>
</svg>`;
}

// AWS Services (using generic cloud/compute icons from simple-icons)
const awsServices = {
    'ec2': simpleIcons.siAmazon,
    'lambda': simpleIcons.siAwslambda,
    's3': simpleIcons.siAmazons3,
    'rds': simpleIcons.siAmazon,
    'dynamodb': simpleIcons.siAmazondynamodb,
    'ecs': simpleIcons.siAmazonecs,
    'eks': simpleIcons.siAmazoneks,
    'cloudfront': simpleIcons.siAmazoncloudwatch,
    'vpc': simpleIcons.siAmazon,
    'iam': simpleIcons.siAmazon,
};

// Azure Services
const azureServices = {
    'vm': simpleIcons.siMicrosoftazure,
    'functions': simpleIcons.siAzurefunctions,
    'aks': simpleIcons.siMicrosoftazure,
    'blob': simpleIcons.siMicrosoftazure,
    'cosmos-db': simpleIcons.siMicrosoftazure,
};

// GCP Services
const gcpServices = {
    'compute-engine': simpleIcons.siGooglecloud,
    'cloud-functions': simpleIcons.siGooglecloud,
    'gke': simpleIcons.siGooglecloud,
    'cloud-storage': simpleIcons.siGooglecloud,
    'firestore': simpleIcons.siFirebase,
};

// Kubernetes
const k8sResources = {
    'pod': simpleIcons.siKubernetes,
    'deployment': simpleIcons.siKubernetes,
    'service': simpleIcons.siKubernetes,
    'ingress': simpleIcons.siKubernetes,
    'configmap': simpleIcons.siKubernetes,
};

// Generic
const genericServices = {
    'docker': simpleIcons.siDocker,
    'jenkins': simpleIcons.siJenkins,
    'gitlab': simpleIcons.siGitlab,
    'github': simpleIcons.siGithub,
    'kafka': simpleIcons.siApachekafka,
    'rabbitmq': simpleIcons.siRabbitmq,
    'redis': simpleIcons.siRedis,
    'postgresql': simpleIcons.siPostgresql,
    'mysql': simpleIcons.siMysql,
    'mongodb': simpleIcons.siMongodb,
    'prometheus': simpleIcons.siPrometheus,
    'grafana': simpleIcons.siGrafana,
    'terraform': simpleIcons.siTerraform,
    'ansible': simpleIcons.siAnsible,
};

// Write SVG files
function writeLogos(provider, services) {
    Object.entries(services).forEach(([name, icon]) => {
        if (!icon) {
            console.warn(`⚠️  Icon not found for ${provider}/${name}`);
            return;
        }

        const svg = iconToSVG(icon);
        const filePath = path.join(LOGOS_DIR, provider, `${name}.svg`);
        fs.writeFileSync(filePath, svg);
        console.log(`✅ Created ${provider}/${name}.svg`);
    });
}

console.log('📦 Downloading logos...\n');

writeLogos('aws', awsServices);
writeLogos('azure', azureServices);
writeLogos('gcp', gcpServices);
writeLogos('kubernetes', k8sResources);
writeLogos('generic', genericServices);

console.log('\n✨ Logo download complete!');
console.log(`📁 Logos saved to: ${LOGOS_DIR}`);
