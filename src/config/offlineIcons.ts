// Comprehensive offline icon library using simple-icons
// Import entire library for maximum compatibility

import * as simpleIcons from 'simple-icons';

export interface OfflineIcon {
    icon: any;
    label: string;
    category: string;
}

// Helper function to convert Simple Icon to data URL
export function simpleIconToDataUrl(icon: any): string {
    if (!icon) return '';

    const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>${icon.title}</title>
        <path fill="#${icon.hex}" d="${icon.path}"/>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Get icon by name (with 'si' prefix)
function getIcon(name: string) {
    return (simpleIcons as any)[name] || null;
}

// Comprehensive offline icon library - 50+ critical logos for architecture
export const OFFLINE_ICONS: Record<string, OfflineIcon> = {
    // CLOUD PROVIDERS
    gcp: { icon: getIcon('siGooglecloud'), label: 'Google Cloud', category: 'cloud' },
    digitalocean: { icon: getIcon('siDigitalocean'), label: 'DigitalOcean', category: 'cloud' },
    heroku: { icon: getIcon('siHeroku'), label: 'Heroku', category: 'cloud' },
    netlify: { icon: getIcon('siNetlify'), label: 'Netlify', category: 'cloud' },
    vercel: { icon: getIcon('siVercel'), label: 'Vercel', category: 'cloud' },
    cloudflare: { icon: getIcon('siCloudflare'), label: 'Cloudflare', category: 'cloud' },

    // PROGRAMMING LANGUAGES
    javascript: { icon: getIcon('siJavascript'), label: 'JavaScript', category: 'language' },
    typescript: { icon: getIcon('siTypescript'), label: 'TypeScript', category: 'language' },
    python: { icon: getIcon('siPython'), label: 'Python', category: 'language' },
    go: { icon: getIcon('siGo'), label: 'Go', category: 'language' },
    rust: { icon: getIcon('siRust'), label: 'Rust', category: 'language' },
    php: { icon: getIcon('siPhp'), label: 'PHP', category: 'language' },
    ruby: { icon: getIcon('siRuby'), label: 'Ruby', category: 'language' },

    // DATABASES
    postgresql: { icon: getIcon('siPostgresql'), label: 'PostgreSQL', category: 'database' },
    mysql: { icon: getIcon('siMysql'), label: 'MySQL', category: 'database' },
    mongodb: { icon: getIcon('siMongodb'), label: 'MongoDB', category: 'database' },
    redis: { icon: getIcon('siRedis'), label: 'Redis', category: 'database' },
    elasticsearch: { icon: getIcon('siElasticsearch'), label: 'Elasticsearch', category: 'database' },
    firebase: { icon: getIcon('siFirebase'), label: 'Firebase', category: 'database' },
    sqlite: { icon: getIcon('siSqlite'), label: 'SQLite', category: 'database' },

    // DEVOPS & CONTAINERS
    docker: { icon: getIcon('siDocker'), label: 'Docker', category: 'devops' },
    kubernetes: { icon: getIcon('siKubernetes'), label: 'Kubernetes', category: 'devops' },
    jenkins: { icon: getIcon('siJenkins'), label: 'Jenkins', category: 'devops' },
    gitlab: { icon: getIcon('siGitlab'), label: 'GitLab', category: 'devops' },
    github: { icon: getIcon('siGithub'), label: 'GitHub', category: 'devops' },
    githubactions: { icon: getIcon('siGithubactions'), label: 'GitHub Actions', category: 'devops' },
    terraform: { icon: getIcon('siTerraform'), label: 'Terraform', category: 'devops' },
    ansible: { icon: getIcon('siAnsible'), label: 'Ansible', category: 'devops' },
    prometheus: { icon: getIcon('siPrometheus'), label: 'Prometheus', category: 'devops' },
    grafana: { icon: getIcon('siGrafana'), label: 'Grafana', category: 'devops' },

    // FRAMEWORKS
    react: { icon: getIcon('siReact'), label: 'React', category: 'framework' },
    vue: { icon: getIcon('siVuedotjs'), label: 'Vue.js', category: 'framework' },
    angular: { icon: getIcon('siAngular'), label: 'Angular', category: 'framework' },
    svelte: { icon: getIcon('siSvelte'), label: 'Svelte', category: 'framework' },
    nextjs: { icon: getIcon('siNextdotjs'), label: 'Next.js', category: 'framework' },
    express: { icon: getIcon('siExpress'), label: 'Express', category: 'framework' },
    nestjs: { icon: getIcon('siNestjs'), label: 'NestJS', category: 'framework' },
    django: { icon: getIcon('siDjango'), label: 'Django', category: 'framework' },
    flask: { icon: getIcon('siFlask'), label: 'Flask', category: 'framework' },
    spring: { icon: getIcon('siSpring'), label: 'Spring', category: 'framework' },

    // MESSAGING
    rabbitmq: { icon: getIcon('siRabbitmq'), label: 'RabbitMQ', category: 'messaging' },
    kafka: { icon: getIcon('siApachekafka'), label: 'Apache Kafka', category: 'messaging' },

    // WEB SERVERS
    nginx: { icon: getIcon('siNginx'), label: 'NGINX', category: 'tools' },
    apache: { icon: getIcon('siApache'), label: 'Apache', category: 'tools' },

    // TOOLS
    git: { icon: getIcon('siGit'), label: 'Git', category: 'tools' },
    npm: { icon: getIcon('siNpm'), label: 'npm', category: 'tools' },
    yarn: { icon: getIcon('siYarn'), label: 'Yarn', category: 'tools' },
    webpack: { icon: getIcon('siWebpack'), label: 'Webpack', category: 'tools' },
    vite: { icon: getIcon('siVite'), label: 'Vite', category: 'tools' },
    eslint: { icon: getIcon('siEslint'), label: 'ESLint', category: 'tools' },
    postman: { icon: getIcon('siPostman'), label: 'Postman', category: 'tools' },
    figma: { icon: getIcon('siFigma'), label: 'Figma', category: 'tools' },
};

// Helper to search offline icons
export function searchOfflineIcons(query: string) {
    const lowerQuery = query.toLowerCase();
    return Object.entries(OFFLINE_ICONS)
        .filter(([key, data]) =>
            key.toLowerCase().includes(lowerQuery) ||
            data.label.toLowerCase().includes(lowerQuery)
        )
        .map(([key, data]) => ({
            key,
            ...data,
            iconUrl: simpleIconToDataUrl(data.icon)
        }));
}

// Get icons by category
export function getIconsByCategory(category: string) {
    return Object.entries(OFFLINE_ICONS)
        .filter(([_, data]) => data.category === category)
        .map(([key, data]) => ({
            key,
            ...data,
            iconUrl: simpleIconToDataUrl(data.icon)
        }));
}

export const ICON_CATEGORIES = ['cloud', 'language', 'database', 'devops', 'framework', 'messaging', 'tools'];
