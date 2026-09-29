import { ChatSession, ProjectItem, PluginItem, ScheduledTask, PullRequestItem } from '../types';

export const INITIAL_RECENTS: ChatSession[] = [
  {
    id: 'recent-search-1',
    title: 'Latest BIS Standards & Hallmark regulations',
    project: 'standards-compliance-portal',
    updatedAt: 'Just now',
    model: 'gemini-3.5-flash (Google Search)',
    approvalMode: false,
    messages: [
      {
        id: 'ms-1',
        sender: 'user',
        content: 'What are the latest Bureau of Indian Standards (BIS) hallmark and quality certification regulations updated this year?',
        timestamp: '11:02 AM',
      },
      {
        id: 'ms-2',
        sender: 'assistant',
        content: 'According to real-time Google Search data grounded via gemini-3.5-flash:\n\n1. **Hallmarking Mandate**: Mandatory 6-digit alphanumeric HUID (Hallmark Unique Identification) is enforced across all notified districts for gold jewelry and artifacts.\n2. **QCOs (Quality Control Orders)**: Over 150 new mandatory technical regulations have been gazetted covering electrical appliances, steel products, footwear, and consumer goods.\n3. **BIS Care Mobile App & Portal**: Consumers and compliance teams can verify HUID numbers and standard mark validity directly against the BIS central database.',
        timestamp: '11:02 AM',
        searchGrounding: {
          queries: [
            'Bureau of Indian Standards hallmark regulations latest updates',
            'BIS quality control orders HUID mandate'
          ],
          sources: [
            {
              title: 'Bureau of Indian Standards Official Portal',
              url: 'https://bis.gov.in'
            },
            {
              title: 'Ministry of Consumer Affairs - Mandatory Gold Hallmarking',
              url: 'https://consumeraffairs.nic.in'
            },
            {
              title: 'National Standards Body of India - Quality Standards',
              url: 'https://standardsbis.in'
            }
          ]
        },
        codeSnippet: {
          filename: 'BisComplianceValidator.ts',
          language: 'typescript',
          code: `export function validateHuidFormat(huid: string): boolean {
  // 6-digit alphanumeric HUID format mandated by BIS
  const huidRegex = /^[A-Z0-9]{6}$/;
  return huidRegex.test(huid.trim());
}`
        }
      }
    ]
  },
  {
    id: 'recent-1',
    title: 'Implement Contact Master module',
    project: 'contact-master-service',
    updatedAt: '12m ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        content: 'Implement Contact Master module with CRUD operations, validation rules for international phone numbers, and company association mapping in Spring Boot.',
        timestamp: '10:45 AM',
      },
      {
        id: 'm2',
        sender: 'assistant',
        content: 'I have scaffolded the Contact Master domain entity, repository with JPA specifications, and service layer with libphonenumber validation. Here is the implementation breakdown:',
        timestamp: '10:46 AM',
        codeSnippet: {
          filename: 'ContactMasterService.java',
          language: 'java',
          code: `@Service
@Transactional
public class ContactMasterService {
    private final ContactRepository contactRepo;
    private final CompanyMappingService companyService;
    private final PhoneNumberValidator phoneValidator;

    public ContactResponse createContact(ContactCreateRequest req) {
        if (!phoneValidator.isValid(req.getPhoneNumber(), req.getCountryCode())) {
            throw new InvalidContactNumberException("E1042: Malformed phone format");
        }
        ContactEntity entity = ContactMapper.toEntity(req);
        entity.setStatus(ContactStatus.ACTIVE);
        return ContactMapper.toResponse(contactRepo.save(entity));
    }
}`
        },
        toolExecution: {
          command: 'mvn test -Dtest=ContactMasterServiceTest',
          output: 'Tests run: 14, Failures: 0, Errors: 0, Skipped: 0 - BUILD SUCCESS (2.1s)',
          status: 'completed'
        }
      }
    ]
  },
  {
    id: 'recent-2',
    title: 'Urban furniture accounting backend',
    project: 'urban-furniture-accounting',
    updatedAt: '1h ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm3',
        sender: 'user',
        content: 'Configure the double-entry ledger database schema for urban furniture sales, depreciation of display fixtures, and vendor payables.',
        timestamp: '09:15 AM'
      },
      {
        id: 'm4',
        sender: 'assistant',
        content: 'Created the SQL migration and DTOs for ledger transactions with balancing check constraints.',
        timestamp: '09:16 AM',
        codeSnippet: {
          filename: 'V12__create_ledger_entries.sql',
          language: 'sql',
          code: `CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    account_code VARCHAR(32) NOT NULL,
    debit_amount NUMERIC(15, 2) DEFAULT 0.00,
    credit_amount NUMERIC(15, 2) DEFAULT 0.00,
    reference_order_id UUID REFERENCES furniture_orders(id),
    CONSTRAINT chk_balanced_entry CHECK (debit_amount >= 0 AND credit_amount >= 0)
);`
        }
      }
    ]
  },
  {
    id: 'recent-3',
    title: 'See the file and all the inside folders of',
    project: 'project',
    updatedAt: '3h ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm5',
        sender: 'user',
        content: 'See the file and all the inside folders of the repository structure.',
        timestamp: '07:30 AM'
      },
      {
        id: 'm6',
        sender: 'assistant',
        content: 'Here is the comprehensive recursive directory tree for the active workspace:\n\n```bash\nproject/\n├── src/\n│   ├── api/\n│   │   ├── controllers/\n│   │   └── middleware/\n│   ├── domain/\n│   │   ├── entities/\n│   │   └── services/\n│   └── config/\n├── database/\n│   └── migrations/\n├── tests/\n└── package.json\n```\nAll files indexed and ready for automated modifications.',
        timestamp: '07:31 AM'
      }
    ]
  },
  {
    id: 'recent-4',
    title: 'Explain Spring annotations',
    project: 'spring-core-notes',
    updatedAt: 'Yesterday',
    model: '5.6 Terra Medium',
    approvalMode: false,
    messages: [
      {
        id: 'm7',
        sender: 'user',
        content: 'Explain Spring annotations like @Component, @Service, @Repository, @Configuration, and @Bean.',
        timestamp: 'Yesterday'
      },
      {
        id: 'm8',
        sender: 'assistant',
        content: 'In Spring Framework, stereotype annotations indicate component roles:\n\n1. **@Component**: General-purpose bean managed by Spring container.\n2. **@Service**: Business logic layer marker.\n3. **@Repository**: Persistence layer marker with automatic DataAccessException translation.\n4. **@Configuration**: Marks classes that define @Bean factory methods.\n5. **@Bean**: Direct instantiation method for 3rd-party classes or custom setup.',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'recent-5',
    title: 'Inspect file info',
    project: 'project',
    updatedAt: '2d ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm9',
        sender: 'user',
        content: 'Inspect file info for main application entry and security filters.',
        timestamp: '2d ago'
      },
      {
        id: 'm10',
        sender: 'assistant',
        content: 'Inspected `SecurityConfig.java` (size: 4.2KB, SHA256: 8a4c1...); verified JWT authentication filter chain and CORS policies.',
        timestamp: '2d ago'
      }
    ]
  },
  {
    id: 'recent-6',
    title: 'Run website preview',
    project: 'storefront-web',
    updatedAt: '3d ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm11',
        sender: 'user',
        content: 'Run website preview and test the checkout flow.',
        timestamp: '3d ago'
      },
      {
        id: 'm12',
        sender: 'assistant',
        content: 'Vite development server started on port 3000. Preview rendered successfully with 0 console warnings.',
        timestamp: '3d ago',
        toolExecution: {
          command: 'npm run dev',
          output: '  VITE v8.3.0  ready in 184 ms\n  ➜  Local:   http://localhost:3000/',
          status: 'completed'
        }
      }
    ]
  },
  {
    id: 'recent-7',
    title: 'Review project files',
    project: 'core-infra',
    updatedAt: '4d ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm13',
        sender: 'user',
        content: 'Review project files for unused dependencies and circular references.',
        timestamp: '4d ago'
      },
      {
        id: 'm14',
        sender: 'assistant',
        content: 'Dependency graph scanned: clean architecture, 0 circular dependencies detected.',
        timestamp: '4d ago'
      }
    ]
  },
  {
    id: 'recent-8',
    title: 'Replicate backend and handle errors',
    project: 'urban-furniture-accounting',
    updatedAt: '5d ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm15',
        sender: 'user',
        content: 'Replicate backend and handle errors for connection drops and failover nodes.',
        timestamp: '5d ago'
      },
      {
        id: 'm16',
        sender: 'assistant',
        content: 'Configured resilient retry policies using Resilience4j circuit breakers and fallback caching.',
        timestamp: '5d ago'
      }
    ]
  },
  {
    id: 'recent-9',
    title: 'Review project files',
    project: 'contact-master-service',
    updatedAt: '6d ago',
    model: '5.6 Terra Medium',
    approvalMode: true,
    messages: [
      {
        id: 'm17',
        sender: 'user',
        content: 'Review project files for test coverage.',
        timestamp: '6d ago'
      },
      {
        id: 'm18',
        sender: 'assistant',
        content: 'Branch coverage is currently at 89.4%. Added additional edge case tests for null postal codes.',
        timestamp: '6d ago'
      }
    ]
  }
];

export const AVAILABLE_PROJECTS: ProjectItem[] = [
  { id: 'p1', name: 'project', path: '~/workspace/project', branch: 'main', lastModified: 'Just now', filesCount: 142 },
  { id: 'p2', name: 'contact-master-service', path: '~/workspace/contact-master', branch: 'feature/v2', lastModified: '12m ago', filesCount: 88 },
  { id: 'p3', name: 'urban-furniture-accounting', path: '~/workspace/urban-furniture', branch: 'develop', lastModified: '1h ago', filesCount: 312 },
  { id: 'p4', name: 'storefront-web', path: '~/workspace/storefront', branch: 'release-2.4', lastModified: '3d ago', filesCount: 204 },
  { id: 'p5', name: 'spring-cloud-gateway', path: '~/workspace/gateway', branch: 'main', lastModified: '1w ago', filesCount: 45 }
];

export const AVAILABLE_MODELS = [
  { id: 'qwen3.8-flash-next:125b-mlx', name: 'qwen 3.8-flash (Ollama)', tag: 'Ollama MLX', description: 'qwen3.8-flash-next:125b-mlx via Ollama chat connection' },
  { id: 'gemini-3.5-flash', name: 'gemini-3.5-flash (Google Search)', tag: 'Google Search', description: 'Real-time Google search grounding for up-to-date facts, standards & docs' },
  { id: 'terra-med', name: '5.6 Terra Medium', tag: 'Recommended', description: 'Optimal balance of speed and deep code reasoning' },
  { id: 'terra-fast', name: '5.6 Terra Fast', tag: 'Fastest', description: 'Ultra-low latency code generation for small edits' },
  { id: 'bis-ultra', name: '6.0 BIS-Ultra', tag: 'Plus', description: 'Deep architectural planning & multi-file refactoring' },
  { id: 'bis-reasoning', name: 'BIS-Reasoning Max', tag: 'Plus', description: 'Rigorous chain-of-thought verification' }
];

export const AVAILABLE_PLUGINS: PluginItem[] = [
  { id: 'pl-1', name: 'Git Graph & Diff Inspector', description: 'Visual interactive commit graphs and side-by-side branch comparisons', version: '2.4.1', enabled: true, author: 'BIS Core' },
  { id: 'pl-2', name: 'Spring Boot Tools Suite', description: 'Language server integration, bean navigation and live actuator metrics', version: '1.9.0', enabled: true, author: 'Spring Tools' },
  { id: 'pl-3', name: 'PostgreSQL Query Runner', description: 'Execute SQL queries, examine explain plans and inspect live schemas', version: '3.1.2', enabled: true, author: 'DataGrip Team' },
  { id: 'pl-4', name: 'Docker & Compose Orchestrator', description: 'Manage local container lifecycles, healthchecks and port forwardings', version: '1.2.0', enabled: false, author: 'DevTools' }
];

export const AVAILABLE_SCHEDULED: ScheduledTask[] = [
  { id: 's-1', name: 'Daily Repository Health Check', schedule: 'Every day at 02:00 AM', status: 'active', lastRun: 'Today, 2:00 AM', target: 'project/main' },
  { id: 's-2', name: 'Dependency Vulnerability Audit', schedule: 'Weekly on Mondays', status: 'active', lastRun: 'Yesterday, 8:00 AM', target: 'contact-master-service' },
  { id: 's-3', name: 'Ledger Reconciliation Sync', schedule: 'Hourly (:00)', status: 'running', lastRun: '10:00 AM', target: 'urban-furniture-accounting' }
];

export const AVAILABLE_PULL_REQUESTS: PullRequestItem[] = [
  { id: 'pr-1', number: 104, title: 'feat: add international phone number validation in Contact Master', branch: 'feat/contact-validation', author: 'Parth Chaudhari', status: 'open', commentsCount: 3, updatedAt: '15m ago' },
  { id: 'pr-2', number: 103, title: 'fix: double entry constraint check on debit/credit balance', branch: 'fix/ledger-balance', author: 'Parth Chaudhari', status: 'merged', commentsCount: 7, updatedAt: '1h ago' },
  { id: 'pr-3', number: 101, title: 'refactor: simplify Spring configuration stereo-types', branch: 'refactor/annotations', author: 'Parth Chaudhari', status: 'open', commentsCount: 1, updatedAt: 'Yesterday' }
];
