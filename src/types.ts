// Curriculum types
export interface Unit {
  id: string;
  title: string;
  sequence: number;
  description: string;
  rationale: string;
  status: 'Draft' | 'In Development' | 'Complete' | 'Blocked';
  dependsOnUnitId?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  sequence: number;
  status: 'Draft' | 'Ready for Dev' | 'In Development' | 'Needs Review' | 'Complete';
  learningObjectives: string[];
  keyConcepts: string[];
  pedagogicalApproach: string;
  rationale: string;
  durationEstimateMinutes: number;
  dependsOnLessonIds?: string[];
}

export interface LessonPhase {
  id: string;
  lessonId: string;
  phaseName: 'Hook' | 'Introduction' | 'Guided Practice' | 'Independent Practice' | 'Assessment' | 'Closing';
  sequence: number;
  description: string;
  developerNotes?: string;
}

export interface AppConnection {
  id: string;
  lessonPhaseId: string;
  type: 'Page' | 'Component' | 'API Endpoint';
  resourceIdentifier: string;
  usageDescription: string;
}

export interface Assessment {
  id: string;
  parentId: string;
  parentType: 'Lesson' | 'Unit';
  title: string;
  type: 'Formative' | 'Summative' | 'Diagnostic';
  format: 'Multiple Choice' | 'Code Challenge' | 'Short Answer' | 'Project';
  description: string;
  evaluationCriteria: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedEntityId: string;
  relatedEntityType: 'Unit' | 'Lesson' | 'LessonPhase' | 'Assessment';
  assigneeId?: string;
  status: 'Todo' | 'In Progress' | 'Blocked' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  blockerDescription?: string;
}

// Component and API types
export interface Component {
  id: string;
  name: string;
  description: string;
  filePath: string;
  usageExample?: string;
}

export interface Api {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestBody?: object;
  responseBody?: object;
}

// Other types
export interface EnvironmentVariable {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface StyleGuidePattern {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample?: string;
}

export interface StateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}

export interface CustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}

export interface Convention {
  id: string;
  rule: string;
  description: string;
}

// Summary types for list operations
export interface UnitSummary {
  id: string;
  title: string;
  sequence: number;
  status: string;
}

export interface LessonSummary {
  id: string;
  unitId: string;
  title: string;
  sequence: number;
  status: string;
}

export interface LessonPhaseSummary {
  id: string;
  lessonId: string;
  phaseName: string;
  sequence: number;
}

export interface AppConnectionSummary {
  id: string;
  lessonPhaseId: string;
  type: string;
  resourceIdentifier: string;
}

export interface AssessmentSummary {
  id: string;
  parentId: string;
  parentType: string;
  title: string;
  type: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  relatedEntityId: string;
  relatedEntityType: string;
  status: string;
  priority: string;
}

export interface ComponentSummary {
  id: string;
  name: string;
  description: string;
  filePath: string;
}

export interface ApiSummary {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  description: string;
}

export interface EnvironmentVariableSummary {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface StyleGuidePatternSummary {
  id: string;
  element: string;
  description: string;
  className: string;
}

export interface StateManagementSummary {
  id: string;
  library: string;
  storeDirectory: string;
}

export interface CustomHookSummary {
  id: string;
  name: string;
  filePath: string;
  description: string;
}

export interface ConventionSummary {
  id: string;
  rule: string;
  description: string;
}

// Database structure
export interface Database {
  components: Component[];
  apis: Api[];
  environment: EnvironmentVariable[];
  'style-guide': StyleGuidePattern[];
  state: StateManagement[];
  hooks: CustomHook[];
  conventions: Convention[];
  units: Unit[];
  lessons: Lesson[];
  lessonPhases: LessonPhase[];
  appConnections: AppConnection[];
  assessments: Assessment[];
  tasks: Task[];
}