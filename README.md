# Curriculum MCP Server

A Model Context Protocol (MCP) server for managing oonline course curriculum, todos, project components, APIs, coding standards, and now, full course curriculums. This server provides tools and resources for Claude Code to interact with your project's knowledge base and educational content.

## Features

- **Component Management**: Track reusable UI components with file paths and usage examples
- **API Documentation**: Manage API endpoints with full request/response details
- **Curriculum Management**: A comprehensive system to document courses, units, lessons, assessments, and their connections to the application.
- **Project Tracking**: A built-in task manager to track development progress against curriculum goals.
- **Environment Variables**: Document required environment variables
- **Style Guide**: Maintain design system patterns and CSS classes
- **State Management**: Document global state management strategies
- **Custom Hooks**: Track reusable React hooks
- **Code Conventions**: Maintain coding standards and linting rules
- **MCP Protocol**: Full Model Context Protocol implementation
- **Claude Code Integration**: Native integration with Claude Code

## Installation

### From npm (when published)
```bash
npm install -g components-mcp
```

### From source
```bash
git clone https://github.com/bodangren/components-mcp.git
cd components-mcp
npm install
```

## Usage

### As MCP Server

Add to your Claude Code project settings:

#### Option 1: Using npx (recommended)
```json
{
  "mcpServers": {
    "components-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["components-mcp"]
    }
  }
}
```

#### Option 2: Global installation
```bash
npm install -g components-mcp
```

```json
{
  "mcpServers": {
    "components-mcp": {
      "type": "stdio",
      "command": "components-mcp"
    }
  }
}
```

#### Option 3: Local path (development)
```json
{
  "mcpServers": {
    "components-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/components-mcp/server.js"]
    }
  }
}
```

### Available Tools

Once configured, Claude Code will have access to these MCP tools:

#### Curriculum
- `get_units`, `create_unit`, `update_unit`, `delete_unit`
- `get_lessons`, `create_lesson`, `update_lesson`, `delete_lesson`
- `get_lesson_phases`, `create_lesson_phase`, `update_lesson_phase`, `delete_lesson_phase`
- `get_app_connections`, `create_app_connection`, `update_app_connection`, `delete_app_connection`
- `get_assessments`, `create_assessment`, `update_assessment`, `delete_assessment`
- `get_tasks`, `create_task`, `update_task`, `delete_task`

#### Components
- `get_components` - List all components or get specific component by ID
- `create_component` - Create new component
- `update_component` - Update existing component
- `delete_component` - Delete component

#### APIs
- `get_apis` - List all APIs or get specific API by ID
- `create_api` - Create new API endpoint
- `update_api` - Update existing API
- `delete_api` - Delete API

#### Other Tools
- `get_environment` - Manage environment variables
- `create_environment` - Create environment variable
- `get_style_guide` - Manage style guide patterns
- `create_style_guide` - Create style guide pattern
- `get_state` - Get state management configurations
- `get_hooks` - Get custom hooks
- `get_conventions` - Get coding conventions

### Available Resources

Access project data via MCP resources:

- `components-mcp://units` - All units
- `components-mcp://lessons` - All lessons
- `components-mcp://lessonPhases` - All lesson phases
- `components-mcp://appConnections` - All app connections
- `components-mcp://assessments` - All assessments
- `components-mcp://tasks` - All tasks
- `components-mcp://components` - All components
- `components-mcp://apis` - All APIs
- `components-mcp://environment` - Environment variables
- `components-mcp://style-guide` - Style guide patterns
- `components-mcp://state` - State management
- `components-mcp://hooks` - Custom hooks
- `components-mcp://conventions` - Code conventions

## Data Models

### Curriculum
```typescript
interface Unit {
  id: string;
  title: string;
  sequence: number;
  description: string;
  rationale: string;
  status: 'Draft' | 'In Development' | 'Complete' | 'Blocked';
  dependsOnUnitId?: string;
}

interface Lesson {
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

interface LessonPhase {
  id: string;
  lessonId: string;
  phaseName: 'Hook' | 'Introduction' | 'Guided Practice' | 'Independent Practice' | 'Assessment' | 'Closing';
  sequence: number;
  description: string;
  developerNotes?: string;
}

interface AppConnection {
  id: string;
  lessonPhaseId: string;
  type: 'Page' | 'Component' | 'API Endpoint';
  resourceIdentifier: string;
  usageDescription: string;
}

interface Assessment {
  id: string;
  parentId: string;
  parentType: 'Lesson' | 'Unit';
  title: string;
  type: 'Formative' | 'Summative' | 'Diagnostic';
  format: 'Multiple Choice' | 'Code Challenge' | 'Short Answer' | 'Project';
  description: string;
  evaluationCriteria: string[];
}

interface Task {
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
```

### Component
```typescript
interface Component {
  id: string;
  name: string;
  description: string;
  filePath: string;
  usageExample?: string;
}
```

### API
```typescript
interface Api {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestBody?: object;
  responseBody?: object;
}
```

### Environment Variable
```typescript
interface EnvironmentVariable {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}
```

### Style Guide Pattern
```typescript
interface StyleGuidePattern {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample?: string;
}
```

### State Management
```typescript
interface StateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}
```

### Custom Hook
```typescript
interface CustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}
```

### Convention
```typescript
interface Convention {
  id: string;
  rule: string;
  description: string;
}
```

## Example Usage in Claude Code

Once configured, you can interact with the server through Claude Code:

```
/mcp
# Shows available MCP servers including components-mcp

# Claude can now use tools like:
# - get_courses to list all courses
# - create_lesson to add a new lesson
# - get_components to list all components
# - create_component to add new components
# - get_apis to see API documentation
# - create_style_guide to document design patterns
```

## Data Storage

Data is persisted in `data/db.json` with the following structure:

```json
{
  "components": [],
  "apis": [],
  "environment": [],
  "style-guide": [],
  "state": [],
  "hooks": [],
  "conventions": [],
  "units": [],
  "lessons": [],
  "lessonPhases": [],
  "appConnections": [],
  "assessments": [],
  "tasks": []
}
```

## Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build TypeScript
npm run build
```

## Model Context Protocol

This server implements the MCP specification:

- **Transport**: stdio (standard input/output)
- **Tools**: 30+ tools for CRUD operations
- **Resources**: 14 resource endpoints for data access
- **Error Handling**: Proper MCP error responses
- **Type Safety**: Full TypeScript support

## Requirements

- Node.js 14+
- Claude Code (for MCP integration)

## License

MIT

## Version

1.1.0

## Author

bodangren

## Repository

https://github.com/bodangren/components-mcp
