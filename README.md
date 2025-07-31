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
npm install -g curriculum-mcp
```

### From source
```bash
git clone https://github.com/bodangren/curriculum-mcp.git
cd curriculum-mcp
npm install
```

## Usage

### As MCP Server

Add to your Claude Code project settings:

#### Option 1: Using npx (recommended)
```json
{
  "mcpServers": {
    "curriculum-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["curriculum-mcp"]
    }
  }
}
```

#### Option 2: Global installation
```bash
npm install -g curriculum-mcp
```

```json
{
  "mcpServers": {
    "curriculum-mcp": {
      "type": "stdio",
      "command": "curriculum-mcp"
    }
  }
}
```

#### Option 3: Local path (development)
```json
{
  "mcpServers": {
    "curriculum-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/curriculum-mcp/server.js"]
    }
  }
}
```

### Available Tools

Once configured, Claude Code will have access to these MCP tools:

### List vs Get Functions

The server provides two types of data retrieval functions:

- **`list_*` functions**: Return summary information (id, name/title, key identifiers) for efficient browsing
- **`get_*` functions**: Return complete entity details when you need full information

This design allows you to efficiently browse large collections without transferring unnecessary data, then fetch full details only when needed.

#### Curriculum Management (18 tools)
- **Units**: `list_units`, `get_units`, `create_unit`, `update_unit`, `delete_unit`
- **Lessons**: `list_lessons`, `get_lessons`, `create_lesson`, `update_lesson`, `delete_lesson`
- **Lesson Phases**: `list_lesson_phases`, `get_lesson_phases`, `create_lesson_phase`, `update_lesson_phase`, `delete_lesson_phase`
- **App Connections**: `list_app_connections`, `get_app_connections`, `create_app_connection`, `update_app_connection`, `delete_app_connection`
- **Assessments**: `list_assessments`, `get_assessments`, `create_assessment`, `update_assessment`, `delete_assessment`
- **Tasks**: `list_tasks`, `get_tasks`, `create_task`, `update_task`, `delete_task`

#### Component Management (4 tools)
- `list_components` - List all components with summary information (id, name, description, filePath)
- `get_components` - Get full component details by ID or list all components
- `create_component` - Create new component
- `update_component`, `delete_component` - Modify existing components

#### API Documentation (4 tools)
- `list_apis` - List all APIs with summary information (id, name, endpoint, method, description)
- `get_apis` - Get full API details by ID or list all APIs
- `create_api` - Create new API endpoint
- `update_api`, `delete_api` - Modify existing APIs

#### Other Tools (17 tools)
- **Environment**: `list_environment`, `get_environment`, `create_environment`
- **Style Guide**: `list_style_guide`, `get_style_guide`, `create_style_guide`
- **State Management**: `list_state`, `get_state`
- **Custom Hooks**: `list_hooks`, `get_hooks`
- **Code Conventions**: `list_conventions`, `get_conventions`

### Available Resources

Access project data via MCP resources:

- `curriculum-mcp://units` - All units
- `curriculum-mcp://lessons` - All lessons
- `curriculum-mcp://lessonPhases` - All lesson phases
- `curriculum-mcp://appConnections` - All app connections
- `curriculum-mcp://assessments` - All assessments
- `curriculum-mcp://tasks` - All tasks
- `curriculum-mcp://components` - All components
- `curriculum-mcp://apis` - All APIs
- `curriculum-mcp://environment` - Environment variables
- `curriculum-mcp://style-guide` - Style guide patterns
- `curriculum-mcp://state` - State management
- `curriculum-mcp://hooks` - Custom hooks
- `curriculum-mcp://conventions` - Code conventions

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
# Shows available MCP servers including curriculum-mcp

# Claude can now use tools like:
# - list_units to browse all units with summary info
# - get_units to get full unit details
# - list_lessons to browse lessons (optionally filtered by unitId)
# - create_lesson to add a new lesson
# - list_components to browse all components
# - get_components to get full component details
# - create_component to add new components
# - list_apis to browse API endpoints
# - get_apis to see full API documentation
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
- **Tools**: 43 tools total (30 CRUD operations + 13 list functions)
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

https://github.com/bodangren/curriculum-mcp
