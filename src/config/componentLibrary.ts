// Component library organized by CATEGORY (not provider)
// Each component has a logo path for visual identification

export interface ComponentDefinition {
    id: string;
    label: string;
    category: string;
    provider: string;
    description: string;
    defaultColor: string;
    logoPath?: string; // Path to SVG logo in /public/logos/
}

// ==================== COMPUTE ====================
export const COMPUTE_COMPONENTS: ComponentDefinition[] = [
    // AWS
    { id: 'aws-ec2', label: 'EC2', category: 'Compute', provider: 'AWS', description: 'Elastic Compute Cloud', defaultColor: '#FF9900', logoPath: '/logos/generic/docker.svg' },
    { id: 'aws-lambda', label: 'Lambda', category: 'Compute', provider: 'AWS', description: 'Serverless Functions', defaultColor: '#FF9900', logoPath: '/logos/generic/docker.svg' },
    { id: 'aws-ecs', label: 'ECS', category: 'Compute', provider: 'AWS', description: 'Elastic Container Service', defaultColor: '#FF9900', logoPath: '/logos/generic/docker.svg' },
    { id: 'aws-eks', label: 'EKS', category: 'Compute', provider: 'AWS', description: 'Elastic Kubernetes Service', defaultColor: '#FF9900', logoPath: '/logos/kubernetes/deployment.svg' },
    { id: 'aws-fargate', label: 'Fargate', category: 'Compute', provider: 'AWS', description: 'Serverless Containers', defaultColor: '#FF9900', logoPath: '/logos/generic/docker.svg' },

    // Azure
    { id: 'azure-vm', label: 'Virtual Machines', category: 'Compute', provider: 'Azure', description: 'Cloud VMs', defaultColor: '#0078D4' },
    { id: 'azure-functions', label: 'Functions', category: 'Compute', provider: 'Azure', description: 'Serverless Functions', defaultColor: '#0078D4' },
    { id: 'azure-aks', label: 'AKS', category: 'Compute', provider: 'Azure', description: 'Azure Kubernetes Service', defaultColor: '#0078D4', logoPath: '/logos/kubernetes/deployment.svg' },

    // GCP
    { id: 'gcp-ce', label: 'Compute Engine', category: 'Compute', provider: 'GCP', description: 'Virtual Machines', defaultColor: '#4285F4', logoPath: '/logos/gcp/compute-engine.svg' },
    { id: 'gcp-functions', label: 'Cloud Functions', category: 'Compute', provider: 'GCP', description: 'Serverless Functions', defaultColor: '#4285F4', logoPath: '/logos/gcp/cloud-functions.svg' },
    { id: 'gcp-gke', label: 'GKE', category: 'Compute', provider: 'GCP', description: 'Google Kubernetes Engine', defaultColor: '#4285F4', logoPath: '/logos/gcp/gke.svg' },
    { id: 'gcp-run', label: 'Cloud Run', category: 'Compute', provider: 'GCP', description: 'Serverless Containers', defaultColor: '#4285F4' },
];

// ==================== STORAGE ====================
export const STORAGE_COMPONENTS: ComponentDefinition[] = [
    // AWS
    { id: 'aws-s3', label: 'S3', category: 'Storage', provider: 'AWS', description: 'Simple Storage Service', defaultColor: '#569A31' },
    { id: 'aws-ebs', label: 'EBS', category: 'Storage', provider: 'AWS', description: 'Elastic Block Store', defaultColor: '#569A31' },
    { id: 'aws-efs', label: 'EFS', category: 'Storage', provider: 'AWS', description: 'Elastic File System', defaultColor: '#569A31' },

    // Azure
    { id: 'azure-blob', label: 'Blob Storage', category: 'Storage', provider: 'Azure', description: 'Object Storage', defaultColor: '#00A4EF' },
    { id: 'azure-files', label: 'Files', category: 'Storage', provider: 'Azure', description: 'File Shares', defaultColor: '#00A4EF' },

    // GCP
    { id: 'gcp-storage', label: 'Cloud Storage', category: 'Storage', provider: 'GCP', description: 'Object Storage', defaultColor: '#FBBC04', logoPath: '/logos/gcp/cloud-storage.svg' },
    { id: 'gcp-disk', label: 'Persistent Disk', category: 'Storage', provider: 'GCP', description: 'Block Storage', defaultColor: '#FBBC04' },
];

// ==================== DATABASE ====================
export const DATABASE_COMPONENTS: ComponentDefinition[] = [
    // AWS
    { id: 'aws-rds', label: 'RDS', category: 'Database', provider: 'AWS', description: 'Relational Database Service', defaultColor: '#3B48CC' },
    { id: 'aws-dynamodb', label: 'DynamoDB', category: 'Database', provider: 'AWS', description: 'NoSQL Database', defaultColor: '#3B48CC' },

    // Azure
    { id: 'azure-sql', label: 'SQL Database', category: 'Database', provider: 'Azure', description: 'Managed SQL', defaultColor: '#00BCF2' },
    { id: 'azure-cosmos', label: 'Cosmos DB', category: 'Database', provider: 'Azure', description: 'Multi-model Database', defaultColor: '#00BCF2' },

    // GCP
    { id: 'gcp-sql', label: 'Cloud SQL', category: 'Database', provider: 'GCP', description: 'Managed SQL', defaultColor: '#EA4335' },
    { id: 'gcp-firestore', label: 'Firestore', category: 'Database', provider: 'GCP', description: 'NoSQL Database', defaultColor: '#EA4335', logoPath: '/logos/gcp/firestore.svg' },

    // Generic
    { id: 'db-postgresql', label: 'PostgreSQL', category: 'Database', provider: 'Generic', description: 'Open-source RDBMS', defaultColor: '#336791', logoPath: '/logos/generic/postgresql.svg' },
    { id: 'db-mysql', label: 'MySQL', category: 'Database', provider: 'Generic', description: 'Open-source RDBMS', defaultColor: '#4479A1', logoPath: '/logos/generic/mysql.svg' },
    { id: 'db-mongodb', label: 'MongoDB', category: 'Database', provider: 'Generic', description: 'Document Database', defaultColor: '#47A248', logoPath: '/logos/generic/mongodb.svg' },
    { id: 'db-redis', label: 'Redis', category: 'Database', provider: 'Generic', description: 'In-Memory Cache', defaultColor: '#DC382D', logoPath: '/logos/generic/redis.svg' },
];

// ==================== CONTAINER & ORCHESTRATION ====================
export const CONTAINER_COMPONENTS: ComponentDefinition[] = [
    // Kubernetes
    { id: 'k8s-pod', label: 'Pod', category: 'Container', provider: 'Kubernetes', description: 'Basic runtime unit', defaultColor: '#326CE5', logoPath: '/logos/kubernetes/pod.svg' },
    { id: 'k8s-deployment', label: 'Deployment', category: 'Container', provider: 'Kubernetes', description: 'Declarative updates', defaultColor: '#326CE5', logoPath: '/logos/kubernetes/deployment.svg' },
    { id: 'k8s-statefulset', label: 'StatefulSet', category: 'Container', provider: 'Kubernetes', description: 'Stateful applications', defaultColor: '#326CE5' },
    { id: 'k8s-service', label: 'Service', category: 'Container', provider: 'Kubernetes', description: 'Network endpoint', defaultColor: '#7BA4E8', logoPath: '/logos/kubernetes/service.svg' },
    { id: 'k8s-ingress', label: 'Ingress', category: 'Container', provider: 'Kubernetes', description: 'HTTP routing', defaultColor: '#7BA4E8', logoPath: '/logos/kubernetes/ingress.svg' },
    { id: 'k8s-configmap', label: 'ConfigMap', category: 'Container', provider: 'Kubernetes', description: 'Configuration data', defaultColor: '#B4D77D', logoPath: '/logos/kubernetes/configmap.svg' },

    // Generic
    { id: 'docker', label: 'Docker', category: 'Container', provider: 'Generic', description: 'Container Platform', defaultColor: '#2496ED', logoPath: '/logos/generic/docker.svg' },
];

// ==================== CI/CD ====================
export const CICD_COMPONENTS: ComponentDefinition[] = [
    { id: 'jenkins', label: 'Jenkins', category: 'CI/CD', provider: 'Generic', description: 'Automation Server', defaultColor: '#D24939', logoPath: '/logos/generic/jenkins.svg' },
    { id: 'gitlab', label: 'GitLab CI', category: 'CI/CD', provider: 'Generic', description: 'DevOps Platform', defaultColor: '#FC6D26', logoPath: '/logos/generic/gitlab.svg' },
    { id: 'github-actions', label: 'GitHub Actions', category: 'CI/CD', provider: 'Generic', description: 'Workflow Automation', defaultColor: '#2088FF', logoPath: '/logos/generic/github.svg' },
];

// ==================== MONITORING ====================
export const MONITORING_COMPONENTS: ComponentDefinition[] = [
    { id: 'prometheus', label: 'Prometheus', category: 'Monitoring', provider: 'Generic', description: 'Metrics & Alerting', defaultColor: '#E6522C', logoPath: '/logos/generic/prometheus.svg' },
    { id: 'grafana', label: 'Grafana', category: 'Monitoring', provider: 'Generic', description: 'Visualization', defaultColor: '#F46800', logoPath: '/logos/generic/grafana.svg' },
    { id: 'aws-cloudwatch', label: 'CloudWatch', category: 'Monitoring', provider: 'AWS', description: 'AWS Monitoring', defaultColor: '#FF4F8B' },
];

// ==================== MESSAGING ====================
export const MESSAGING_COMPONENTS: ComponentDefinition[] = [
    { id: 'kafka', label: 'Apache Kafka', category: 'Messaging', provider: 'Generic', description: 'Event Streaming', defaultColor: '#000000', logoPath: '/logos/generic/kafka.svg' },
    { id: 'rabbitmq', label: 'RabbitMQ', category: 'Messaging', provider: 'Generic', description: 'Message Broker', defaultColor: '#FF6600', logoPath: '/logos/generic/rabbitmq.svg' },
];

// ==================== INFRASTRUCTURE ====================
export const INFRASTRUCTURE_COMPONENTS: ComponentDefinition[] = [
    { id: 'terraform', label: 'Terraform', category: 'Infrastructure', provider: 'Generic', description: 'Infrastructure as Code', defaultColor: '#7B42BC', logoPath: '/logos/generic/terraform.svg' },
    { id: 'ansible', label: 'Ansible', category: 'Infrastructure', provider: 'Generic', description: 'Configuration Management', defaultColor: '#EE0000', logoPath: '/logos/generic/ansible.svg' },
];

// ==================== NETWORKING ====================
export const NETWORKING_COMPONENTS: ComponentDefinition[] = [
    { id: 'aws-vpc', label: 'VPC', category: 'Networking', provider: 'AWS', description: 'Virtual Private Cloud', defaultColor: '#8C4FFF' },
    { id: 'aws-elb', label: 'Load Balancer', category: 'Networking', provider: 'AWS', description: 'Elastic Load Balancer', defaultColor: '#8C4FFF' },
    { id: 'azure-vnet', label: 'Virtual Network', category: 'Networking', provider: 'Azure', description: 'Private Network', defaultColor: '#59B4D9' },
    { id: 'net-firewall', label: 'Firewall', category: 'Networking', provider: 'Generic', description: 'Network Security', defaultColor: '#EF4444' },
];

// ==================== SECURITY ====================
export const SECURITY_COMPONENTS: ComponentDefinition[] = [
    { id: 'aws-iam', label: 'IAM', category: 'Security', provider: 'AWS', description: 'Identity & Access Management', defaultColor: '#DD344C' },
    { id: 'aws-cognito', label: 'Cognito', category: 'Security', provider: 'AWS', description: 'User Authentication', defaultColor: '#DD344C' },
    { id: 'aws-kms', label: 'KMS', category: 'Security', provider: 'AWS', description: 'Key Management Service', defaultColor: '#DD344C' },
];

// Combine all components by category
export const COMPONENT_LIBRARY_BY_CATEGORY = {
    Compute: COMPUTE_COMPONENTS,
    Storage: STORAGE_COMPONENTS,
    Database: DATABASE_COMPONENTS,
    Container: CONTAINER_COMPONENTS,
    'CI/CD': CICD_COMPONENTS,
    Monitoring: MONITORING_COMPONENTS,
    Messaging: MESSAGING_COMPONENTS,
    Infrastructure: INFRASTRUCTURE_COMPONENTS,
    Networking: NETWORKING_COMPONENTS,
    Security: SECURITY_COMPONENTS,
};

// Helper to get all components
export function getAllComponents(): ComponentDefinition[] {
    return Object.values(COMPONENT_LIBRARY_BY_CATEGORY).flat();
}

// Helper to get components by category
export function getComponentsByCategory(category: string): ComponentDefinition[] {
    return COMPONENT_LIBRARY_BY_CATEGORY[category as keyof typeof COMPONENT_LIBRARY_BY_CATEGORY] || [];
}

// Helper to get components by provider
export function getComponentsByProvider(provider: string): ComponentDefinition[] {
    return getAllComponents().filter(c => c.provider === provider);
}

// Helper to search components
export function searchComponents(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase();
    return getAllComponents().filter(c =>
        c.label.toLowerCase().includes(lowerQuery) ||
        c.id.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    );
}

export const CATEGORIES = Object.keys(COMPONENT_LIBRARY_BY_CATEGORY);
export const PROVIDERS = ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Generic'];
