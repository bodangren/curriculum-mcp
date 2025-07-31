#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DatabaseManager } from './database.js';
import {
  Unit, Lesson, LessonPhase, AppConnection, Assessment, Task,
  Component, Api, EnvironmentVariable, StyleGuidePattern,
  StateManagement, CustomHook, Convention,
  UnitSummary, LessonSummary, LessonPhaseSummary, AppConnectionSummary,
  AssessmentSummary, TaskSummary, ComponentSummary, ApiSummary,
  EnvironmentVariableSummary, StyleGuidePatternSummary, StateManagementSummary,
  CustomHookSummary, ConventionSummary
} from './types.js';

class ComponentsMCPServer {
  private server: Server;
  private db: DatabaseManager;

  constructor() {
    this.server = new Server(
      {
        name: 'curriculum-mcp',
        version: '1.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.db = DatabaseManager.getInstance();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'curriculum-mcp://units',
            mimeType: 'application/json',
            name: 'All units',
            description: 'All curriculum units',
          },
          {
            uri: 'curriculum-mcp://lessons',
            mimeType: 'application/json',
            name: 'All lessons',
            description: 'All curriculum lessons',
          },
          {
            uri: 'curriculum-mcp://lessonPhases',
            mimeType: 'application/json',
            name: 'All lesson phases',
            description: 'All lesson phases',
          },
          {
            uri: 'curriculum-mcp://appConnections',
            mimeType: 'application/json',
            name: 'All app connections',
            description: 'All app connections',
          },
          {
            uri: 'curriculum-mcp://assessments',
            mimeType: 'application/json',
            name: 'All assessments',
            description: 'All assessments',
          },
          {
            uri: 'curriculum-mcp://tasks',
            mimeType: 'application/json',
            name: 'All tasks',
            description: 'All tasks',
          },
          {
            uri: 'curriculum-mcp://components',
            mimeType: 'application/json',
            name: 'All components',
            description: 'All UI components',
          },
          {
            uri: 'curriculum-mcp://apis',
            mimeType: 'application/json',
            name: 'All APIs',
            description: 'All API endpoints',
          },
          {
            uri: 'curriculum-mcp://environment',
            mimeType: 'application/json',
            name: 'Environment variables',
            description: 'Environment variable documentation',
          },
          {
            uri: 'curriculum-mcp://style-guide',
            mimeType: 'application/json',
            name: 'Style guide',
            description: 'Style guide patterns',
          },
          {
            uri: 'curriculum-mcp://state',
            mimeType: 'application/json',
            name: 'State management',
            description: 'State management configurations',
          },
          {
            uri: 'curriculum-mcp://hooks',
            mimeType: 'application/json',
            name: 'Custom hooks',
            description: 'Custom React hooks',
          },
          {
            uri: 'curriculum-mcp://conventions',
            mimeType: 'application/json',
            name: 'Code conventions',
            description: 'Coding standards and conventions',
          },
        ],
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const resourceType = uri.replace('curriculum-mcp://', '');

      try {
        const data = this.db.getCollection(resourceType as keyof DatabaseManager['db']);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Failed to read resource: ${error}`);
      }
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Unit tools
          {
            name: 'list_units',
            description: 'List all units with summary information (id, title, sequence, status)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_units',
            description: 'Get all units or a specific unit by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional unit ID' },
              },
            },
          },
          {
            name: 'create_unit',
            description: 'Create a new unit',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                sequence: { type: 'number' },
                description: { type: 'string' },
                rationale: { type: 'string' },
                status: { type: 'string', enum: ['Draft', 'In Development', 'Complete', 'Blocked'] },
                dependsOnUnitId: { type: 'string' },
              },
              required: ['title', 'sequence', 'description', 'rationale', 'status'],
            },
          },
          {
            name: 'update_unit',
            description: 'Update an existing unit',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                sequence: { type: 'number' },
                description: { type: 'string' },
                rationale: { type: 'string' },
                status: { type: 'string', enum: ['Draft', 'In Development', 'Complete', 'Blocked'] },
                dependsOnUnitId: { type: 'string' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_unit',
            description: 'Delete a unit by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Lesson tools
          {
            name: 'list_lessons',
            description: 'List all lessons with summary information (id, unitId, title, sequence, status)',
            inputSchema: {
              type: 'object',
              properties: {
                unitId: { type: 'string', description: 'Optional unit ID to filter lessons' },
              },
            },
          },
          {
            name: 'get_lessons',
            description: 'Get all lessons or a specific lesson by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional lesson ID' },
                unitId: { type: 'string', description: 'Optional unit ID to filter lessons' },
              },
            },
          },
          {
            name: 'create_lesson',
            description: 'Create a new lesson',
            inputSchema: {
              type: 'object',
              properties: {
                unitId: { type: 'string' },
                title: { type: 'string' },
                sequence: { type: 'number' },
                status: { type: 'string', enum: ['Draft', 'Ready for Dev', 'In Development', 'Needs Review', 'Complete'] },
                learningObjectives: { type: 'array', items: { type: 'string' } },
                keyConcepts: { type: 'array', items: { type: 'string' } },
                pedagogicalApproach: { type: 'string' },
                rationale: { type: 'string' },
                durationEstimateMinutes: { type: 'number' },
                dependsOnLessonIds: { type: 'array', items: { type: 'string' } },
              },
              required: ['unitId', 'title', 'sequence', 'status', 'learningObjectives', 'keyConcepts', 'pedagogicalApproach', 'rationale', 'durationEstimateMinutes'],
            },
          },
          {
            name: 'update_lesson',
            description: 'Update an existing lesson',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                unitId: { type: 'string' },
                title: { type: 'string' },
                sequence: { type: 'number' },
                status: { type: 'string', enum: ['Draft', 'Ready for Dev', 'In Development', 'Needs Review', 'Complete'] },
                learningObjectives: { type: 'array', items: { type: 'string' } },
                keyConcepts: { type: 'array', items: { type: 'string' } },
                pedagogicalApproach: { type: 'string' },
                rationale: { type: 'string' },
                durationEstimateMinutes: { type: 'number' },
                dependsOnLessonIds: { type: 'array', items: { type: 'string' } },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_lesson',
            description: 'Delete a lesson by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Lesson Phase tools
          {
            name: 'list_lesson_phases',
            description: 'List all lesson phases with summary information (id, lessonId, phaseName, sequence)',
            inputSchema: {
              type: 'object',
              properties: {
                lessonId: { type: 'string', description: 'Optional lesson ID to filter phases' },
              },
            },
          },
          {
            name: 'get_lesson_phases',
            description: 'Get all lesson phases or a specific lesson phase by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional lesson phase ID' },
                lessonId: { type: 'string', description: 'Optional lesson ID to filter phases' },
              },
            },
          },
          {
            name: 'create_lesson_phase',
            description: 'Create a new lesson phase',
            inputSchema: {
              type: 'object',
              properties: {
                lessonId: { type: 'string' },
                phaseName: { type: 'string', enum: ['Hook', 'Introduction', 'Guided Practice', 'Independent Practice', 'Assessment', 'Closing'] },
                sequence: { type: 'number' },
                description: { type: 'string' },
                developerNotes: { type: 'string' },
              },
              required: ['lessonId', 'phaseName', 'sequence', 'description'],
            },
          },
          {
            name: 'update_lesson_phase',
            description: 'Update an existing lesson phase',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                lessonId: { type: 'string' },
                phaseName: { type: 'string', enum: ['Hook', 'Introduction', 'Guided Practice', 'Independent Practice', 'Assessment', 'Closing'] },
                sequence: { type: 'number' },
                description: { type: 'string' },
                developerNotes: { type: 'string' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_lesson_phase',
            description: 'Delete a lesson phase by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // App Connection tools
          {
            name: 'list_app_connections',
            description: 'List all app connections with summary information (id, lessonPhaseId, type, resourceIdentifier)',
            inputSchema: {
              type: 'object',
              properties: {
                lessonPhaseId: { type: 'string', description: 'Optional lesson phase ID to filter connections' },
              },
            },
          },
          {
            name: 'get_app_connections',
            description: 'Get all app connections or a specific app connection by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional app connection ID' },
                lessonPhaseId: { type: 'string', description: 'Optional lesson phase ID to filter connections' },
              },
            },
          },
          {
            name: 'create_app_connection',
            description: 'Create a new app connection',
            inputSchema: {
              type: 'object',
              properties: {
                lessonPhaseId: { type: 'string' },
                type: { type: 'string', enum: ['Page', 'Component', 'API Endpoint'] },
                resourceIdentifier: { type: 'string' },
                usageDescription: { type: 'string' },
              },
              required: ['lessonPhaseId', 'type', 'resourceIdentifier', 'usageDescription'],
            },
          },
          {
            name: 'update_app_connection',
            description: 'Update an existing app connection',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                lessonPhaseId: { type: 'string' },
                type: { type: 'string', enum: ['Page', 'Component', 'API Endpoint'] },
                resourceIdentifier: { type: 'string' },
                usageDescription: { type: 'string' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_app_connection',
            description: 'Delete an app connection by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Assessment tools
          {
            name: 'list_assessments',
            description: 'List all assessments with summary information (id, parentId, parentType, title, type)',
            inputSchema: {
              type: 'object',
              properties: {
                parentId: { type: 'string', description: 'Optional parent ID to filter assessments' },
                parentType: { type: 'string', enum: ['Lesson', 'Unit'], description: 'Optional parent type to filter assessments' },
              },
            },
          },
          {
            name: 'get_assessments',
            description: 'Get all assessments or a specific assessment by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional assessment ID' },
                parentId: { type: 'string', description: 'Optional parent ID to filter assessments' },
                parentType: { type: 'string', enum: ['Lesson', 'Unit'], description: 'Optional parent type to filter assessments' },
              },
            },
          },
          {
            name: 'create_assessment',
            description: 'Create a new assessment',
            inputSchema: {
              type: 'object',
              properties: {
                parentId: { type: 'string' },
                parentType: { type: 'string', enum: ['Lesson', 'Unit'] },
                title: { type: 'string' },
                type: { type: 'string', enum: ['Formative', 'Summative', 'Diagnostic'] },
                format: { type: 'string', enum: ['Multiple Choice', 'Code Challenge', 'Short Answer', 'Project'] },
                description: { type: 'string' },
                evaluationCriteria: { type: 'array', items: { type: 'string' } },
              },
              required: ['parentId', 'parentType', 'title', 'type', 'format', 'description', 'evaluationCriteria'],
            },
          },
          {
            name: 'update_assessment',
            description: 'Update an existing assessment',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                parentId: { type: 'string' },
                parentType: { type: 'string', enum: ['Lesson', 'Unit'] },
                title: { type: 'string' },
                type: { type: 'string', enum: ['Formative', 'Summative', 'Diagnostic'] },
                format: { type: 'string', enum: ['Multiple Choice', 'Code Challenge', 'Short Answer', 'Project'] },
                description: { type: 'string' },
                evaluationCriteria: { type: 'array', items: { type: 'string' } },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_assessment',
            description: 'Delete an assessment by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Task tools
          {
            name: 'list_tasks',
            description: 'List all tasks with summary information (id, title, relatedEntityId, relatedEntityType, status, priority)',
            inputSchema: {
              type: 'object',
              properties: {
                relatedEntityId: { type: 'string', description: 'Optional related entity ID to filter tasks' },
                relatedEntityType: { type: 'string', enum: ['Unit', 'Lesson', 'LessonPhase', 'Assessment'], description: 'Optional related entity type to filter tasks' },
                status: { type: 'string', enum: ['Todo', 'In Progress', 'Blocked', 'In Review', 'Done'], description: 'Optional status to filter tasks' },
              },
            },
          },
          {
            name: 'get_tasks',
            description: 'Get all tasks or a specific task by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional task ID' },
                relatedEntityId: { type: 'string', description: 'Optional related entity ID to filter tasks' },
                relatedEntityType: { type: 'string', enum: ['Unit', 'Lesson', 'LessonPhase', 'Assessment'], description: 'Optional related entity type to filter tasks' },
                status: { type: 'string', enum: ['Todo', 'In Progress', 'Blocked', 'In Review', 'Done'], description: 'Optional status to filter tasks' },
              },
            },
          },
          {
            name: 'create_task',
            description: 'Create a new task',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                relatedEntityId: { type: 'string' },
                relatedEntityType: { type: 'string', enum: ['Unit', 'Lesson', 'LessonPhase', 'Assessment'] },
                assigneeId: { type: 'string' },
                status: { type: 'string', enum: ['Todo', 'In Progress', 'Blocked', 'In Review', 'Done'] },
                priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
                blockerDescription: { type: 'string' },
              },
              required: ['title', 'description', 'relatedEntityId', 'relatedEntityType', 'status', 'priority'],
            },
          },
          {
            name: 'update_task',
            description: 'Update an existing task',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                relatedEntityId: { type: 'string' },
                relatedEntityType: { type: 'string', enum: ['Unit', 'Lesson', 'LessonPhase', 'Assessment'] },
                assigneeId: { type: 'string' },
                status: { type: 'string', enum: ['Todo', 'In Progress', 'Blocked', 'In Review', 'Done'] },
                priority: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] },
                blockerDescription: { type: 'string' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_task',
            description: 'Delete a task by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Component tools
          {
            name: 'list_components',
            description: 'List all components with summary information (id, name, description, filePath)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_components',
            description: 'Get all components or a specific component by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional component ID' },
              },
            },
          },
          {
            name: 'create_component',
            description: 'Create a new component',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                filePath: { type: 'string' },
                usageExample: { type: 'string' },
              },
              required: ['name', 'description', 'filePath'],
            },
          },
          {
            name: 'update_component',
            description: 'Update an existing component',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                filePath: { type: 'string' },
                usageExample: { type: 'string' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_component',
            description: 'Delete a component by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // API tools
          {
            name: 'list_apis',
            description: 'List all APIs with summary information (id, name, endpoint, method, description)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_apis',
            description: 'Get all APIs or a specific API by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional API ID' },
              },
            },
          },
          {
            name: 'create_api',
            description: 'Create a new API endpoint',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                endpoint: { type: 'string' },
                method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
                description: { type: 'string' },
                requestBody: { type: 'object' },
                responseBody: { type: 'object' },
              },
              required: ['name', 'endpoint', 'method', 'description'],
            },
          },
          {
            name: 'update_api',
            description: 'Update an existing API',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                endpoint: { type: 'string' },
                method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
                description: { type: 'string' },
                requestBody: { type: 'object' },
                responseBody: { type: 'object' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_api',
            description: 'Delete an API by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
          // Environment tools
          {
            name: 'list_environment',
            description: 'List all environment variables with summary information (id, name, description, isPublic)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_environment',
            description: 'Get all environment variables or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional environment variable ID' },
              },
            },
          },
          {
            name: 'create_environment',
            description: 'Create a new environment variable',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                isPublic: { type: 'boolean' },
              },
              required: ['name', 'description', 'isPublic'],
            },
          },
          // Style Guide tools
          {
            name: 'list_style_guide',
            description: 'List all style guide patterns with summary information (id, element, description, className)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_style_guide',
            description: 'Get all style guide patterns or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional style guide pattern ID' },
              },
            },
          },
          {
            name: 'create_style_guide',
            description: 'Create a new style guide pattern',
            inputSchema: {
              type: 'object',
              properties: {
                element: { type: 'string' },
                description: { type: 'string' },
                className: { type: 'string' },
                usageExample: { type: 'string' },
              },
              required: ['element', 'description', 'className'],
            },
          },
          // State Management tools
          {
            name: 'list_state',
            description: 'List all state management configurations with summary information (id, library, storeDirectory)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_state',
            description: 'Get all state management configurations or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional state management ID' },
              },
            },
          },
          // Custom Hooks tools
          {
            name: 'list_hooks',
            description: 'List all custom hooks with summary information (id, name, filePath, description)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_hooks',
            description: 'Get all custom hooks or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional custom hook ID' },
              },
            },
          },
          // Conventions tools
          {
            name: 'list_conventions',
            description: 'List all code conventions with summary information (id, rule, description)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_conventions',
            description: 'Get all code conventions or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Optional convention ID' },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Unit operations
          case 'list_units':
            return this.handleListUnits(args);
          case 'get_units':
            return this.handleGetUnits(args);
          case 'create_unit':
            return this.handleCreateUnit(args);
          case 'update_unit':
            return this.handleUpdateUnit(args);
          case 'delete_unit':
            return this.handleDeleteUnit(args);

          // Lesson operations
          case 'list_lessons':
            return this.handleListLessons(args);
          case 'get_lessons':
            return this.handleGetLessons(args);
          case 'create_lesson':
            return this.handleCreateLesson(args);
          case 'update_lesson':
            return this.handleUpdateLesson(args);
          case 'delete_lesson':
            return this.handleDeleteLesson(args);

          // Lesson Phase operations
          case 'list_lesson_phases':
            return this.handleListLessonPhases(args);
          case 'get_lesson_phases':
            return this.handleGetLessonPhases(args);
          case 'create_lesson_phase':
            return this.handleCreateLessonPhase(args);
          case 'update_lesson_phase':
            return this.handleUpdateLessonPhase(args);
          case 'delete_lesson_phase':
            return this.handleDeleteLessonPhase(args);

          // App Connection operations
          case 'list_app_connections':
            return this.handleListAppConnections(args);
          case 'get_app_connections':
            return this.handleGetAppConnections(args);
          case 'create_app_connection':
            return this.handleCreateAppConnection(args);
          case 'update_app_connection':
            return this.handleUpdateAppConnection(args);
          case 'delete_app_connection':
            return this.handleDeleteAppConnection(args);

          // Assessment operations
          case 'list_assessments':
            return this.handleListAssessments(args);
          case 'get_assessments':
            return this.handleGetAssessments(args);
          case 'create_assessment':
            return this.handleCreateAssessment(args);
          case 'update_assessment':
            return this.handleUpdateAssessment(args);
          case 'delete_assessment':
            return this.handleDeleteAssessment(args);

          // Task operations
          case 'list_tasks':
            return this.handleListTasks(args);
          case 'get_tasks':
            return this.handleGetTasks(args);
          case 'create_task':
            return this.handleCreateTask(args);
          case 'update_task':
            return this.handleUpdateTask(args);
          case 'delete_task':
            return this.handleDeleteTask(args);

          // Component operations
          case 'list_components':
            return this.handleListComponents(args);
          case 'get_components':
            return this.handleGetComponents(args);
          case 'create_component':
            return this.handleCreateComponent(args);
          case 'update_component':
            return this.handleUpdateComponent(args);
          case 'delete_component':
            return this.handleDeleteComponent(args);

          // API operations
          case 'list_apis':
            return this.handleListApis(args);
          case 'get_apis':
            return this.handleGetApis(args);
          case 'create_api':
            return this.handleCreateApi(args);
          case 'update_api':
            return this.handleUpdateApi(args);
          case 'delete_api':
            return this.handleDeleteApi(args);

          // Environment operations
          case 'list_environment':
            return this.handleListEnvironment(args);
          case 'get_environment':
            return this.handleGetEnvironment(args);
          case 'create_environment':
            return this.handleCreateEnvironment(args);

          // Style Guide operations
          case 'list_style_guide':
            return this.handleListStyleGuide(args);
          case 'get_style_guide':
            return this.handleGetStyleGuide(args);
          case 'create_style_guide':
            return this.handleCreateStyleGuide(args);

          // State Management operations
          case 'list_state':
            return this.handleListState(args);
          case 'get_state':
            return this.handleGetState(args);

          // Custom Hooks operations
          case 'list_hooks':
            return this.handleListHooks(args);
          case 'get_hooks':
            return this.handleGetHooks(args);

          // Conventions operations
          case 'list_conventions':
            return this.handleListConventions(args);
          case 'get_conventions':
            return this.handleGetConventions(args);

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  // Unit handlers
  private async handleListUnits(args: any) {
    const units = this.db.getCollection<Unit>('units');
    const summaries: UnitSummary[] = units.map(unit => ({
      id: unit.id,
      title: unit.title,
      sequence: unit.sequence,
      status: unit.status,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetUnits(args: any) {
    if (args.id) {
      const unit = this.db.findById<Unit>('units', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(unit, null, 2) }],
      };
    }
    const units = this.db.getCollection<Unit>('units');
    return {
      content: [{ type: 'text', text: JSON.stringify(units, null, 2) }],
    };
  }

  private async handleCreateUnit(args: any) {
    const unit: Unit = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('units', unit);
    return {
      content: [{ type: 'text', text: `Created unit: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateUnit(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Unit>('units', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Unit with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated unit: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteUnit(args: any) {
    const deleted = this.db.deleteFromCollection('units', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Unit with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted unit with ID: ${args.id}` }],
    };
  }

  // Lesson handlers
  private async handleListLessons(args: any) {
    let lessons = this.db.getCollection<Lesson>('lessons');
    
    if (args.unitId) {
      lessons = lessons.filter(lesson => lesson.unitId === args.unitId);
    }
    
    const summaries: LessonSummary[] = lessons.map(lesson => ({
      id: lesson.id,
      unitId: lesson.unitId,
      title: lesson.title,
      sequence: lesson.sequence,
      status: lesson.status,
    }));
    
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetLessons(args: any) {
    let lessons = this.db.getCollection<Lesson>('lessons');
    
    if (args.unitId) {
      lessons = lessons.filter(lesson => lesson.unitId === args.unitId);
    }
    
    if (args.id) {
      const lesson = lessons.find(l => l.id === args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(lesson, null, 2) }],
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(lessons, null, 2) }],
    };
  }

  private async handleCreateLesson(args: any) {
    const lesson: Lesson = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('lessons', lesson);
    return {
      content: [{ type: 'text', text: `Created lesson: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateLesson(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Lesson>('lessons', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Lesson with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated lesson: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteLesson(args: any) {
    const deleted = this.db.deleteFromCollection('lessons', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Lesson with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted lesson with ID: ${args.id}` }],
    };
  }

  // Lesson Phase handlers
  private async handleListLessonPhases(args: any) {
    let lessonPhases = this.db.getCollection<LessonPhase>('lessonPhases');
    
    if (args.lessonId) {
      lessonPhases = lessonPhases.filter(phase => phase.lessonId === args.lessonId);
    }
    
    const summaries: LessonPhaseSummary[] = lessonPhases.map(phase => ({
      id: phase.id,
      lessonId: phase.lessonId,
      phaseName: phase.phaseName,
      sequence: phase.sequence,
    }));
    
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetLessonPhases(args: any) {
    let lessonPhases = this.db.getCollection<LessonPhase>('lessonPhases');
    
    if (args.lessonId) {
      lessonPhases = lessonPhases.filter(phase => phase.lessonId === args.lessonId);
    }
    
    if (args.id) {
      const lessonPhase = lessonPhases.find(p => p.id === args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(lessonPhase, null, 2) }],
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(lessonPhases, null, 2) }],
    };
  }

  private async handleCreateLessonPhase(args: any) {
    const lessonPhase: LessonPhase = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('lessonPhases', lessonPhase);
    return {
      content: [{ type: 'text', text: `Created lesson phase: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateLessonPhase(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<LessonPhase>('lessonPhases', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Lesson phase with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated lesson phase: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteLessonPhase(args: any) {
    const deleted = this.db.deleteFromCollection('lessonPhases', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Lesson phase with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted lesson phase with ID: ${args.id}` }],
    };
  }

  // App Connection handlers
  private async handleListAppConnections(args: any) {
    let appConnections = this.db.getCollection<AppConnection>('appConnections');
    
    if (args.lessonPhaseId) {
      appConnections = appConnections.filter(conn => conn.lessonPhaseId === args.lessonPhaseId);
    }
    
    const summaries: AppConnectionSummary[] = appConnections.map(conn => ({
      id: conn.id,
      lessonPhaseId: conn.lessonPhaseId,
      type: conn.type,
      resourceIdentifier: conn.resourceIdentifier,
    }));
    
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetAppConnections(args: any) {
    let appConnections = this.db.getCollection<AppConnection>('appConnections');
    
    if (args.lessonPhaseId) {
      appConnections = appConnections.filter(conn => conn.lessonPhaseId === args.lessonPhaseId);
    }
    
    if (args.id) {
      const appConnection = appConnections.find(c => c.id === args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(appConnection, null, 2) }],
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(appConnections, null, 2) }],
    };
  }

  private async handleCreateAppConnection(args: any) {
    const appConnection: AppConnection = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('appConnections', appConnection);
    return {
      content: [{ type: 'text', text: `Created app connection: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateAppConnection(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<AppConnection>('appConnections', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `App connection with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated app connection: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteAppConnection(args: any) {
    const deleted = this.db.deleteFromCollection('appConnections', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `App connection with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted app connection with ID: ${args.id}` }],
    };
  }

  // Assessment handlers
  private async handleListAssessments(args: any) {
    let assessments = this.db.getCollection<Assessment>('assessments');
    
    if (args.parentId && args.parentType) {
      assessments = assessments.filter(assessment => 
        assessment.parentId === args.parentId && assessment.parentType === args.parentType
      );
    } else if (args.parentId) {
      assessments = assessments.filter(assessment => assessment.parentId === args.parentId);
    } else if (args.parentType) {
      assessments = assessments.filter(assessment => assessment.parentType === args.parentType);
    }
    
    const summaries: AssessmentSummary[] = assessments.map(assessment => ({
      id: assessment.id,
      parentId: assessment.parentId,
      parentType: assessment.parentType,
      title: assessment.title,
      type: assessment.type,
    }));
    
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetAssessments(args: any) {
    let assessments = this.db.getCollection<Assessment>('assessments');
    
    if (args.parentId && args.parentType) {
      assessments = assessments.filter(assessment => 
        assessment.parentId === args.parentId && assessment.parentType === args.parentType
      );
    } else if (args.parentId) {
      assessments = assessments.filter(assessment => assessment.parentId === args.parentId);
    } else if (args.parentType) {
      assessments = assessments.filter(assessment => assessment.parentType === args.parentType);
    }
    
    if (args.id) {
      const assessment = assessments.find(a => a.id === args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(assessment, null, 2) }],
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(assessments, null, 2) }],
    };
  }

  private async handleCreateAssessment(args: any) {
    const assessment: Assessment = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('assessments', assessment);
    return {
      content: [{ type: 'text', text: `Created assessment: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateAssessment(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Assessment>('assessments', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Assessment with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated assessment: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteAssessment(args: any) {
    const deleted = this.db.deleteFromCollection('assessments', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Assessment with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted assessment with ID: ${args.id}` }],
    };
  }

  // Task handlers
  private async handleListTasks(args: any) {
    let tasks = this.db.getCollection<Task>('tasks');
    
    if (args.relatedEntityId && args.relatedEntityType) {
      tasks = tasks.filter(task => 
        task.relatedEntityId === args.relatedEntityId && task.relatedEntityType === args.relatedEntityType
      );
    } else if (args.relatedEntityId) {
      tasks = tasks.filter(task => task.relatedEntityId === args.relatedEntityId);
    } else if (args.relatedEntityType) {
      tasks = tasks.filter(task => task.relatedEntityType === args.relatedEntityType);
    }
    
    if (args.status) {
      tasks = tasks.filter(task => task.status === args.status);
    }
    
    const summaries: TaskSummary[] = tasks.map(task => ({
      id: task.id,
      title: task.title,
      relatedEntityId: task.relatedEntityId,
      relatedEntityType: task.relatedEntityType,
      status: task.status,
      priority: task.priority,
    }));
    
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetTasks(args: any) {
    let tasks = this.db.getCollection<Task>('tasks');
    
    if (args.relatedEntityId && args.relatedEntityType) {
      tasks = tasks.filter(task => 
        task.relatedEntityId === args.relatedEntityId && task.relatedEntityType === args.relatedEntityType
      );
    } else if (args.relatedEntityId) {
      tasks = tasks.filter(task => task.relatedEntityId === args.relatedEntityId);
    } else if (args.relatedEntityType) {
      tasks = tasks.filter(task => task.relatedEntityType === args.relatedEntityType);
    }
    
    if (args.status) {
      tasks = tasks.filter(task => task.status === args.status);
    }
    
    if (args.id) {
      const task = tasks.find(t => t.id === args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(task, null, 2) }],
      };
    }
    
    return {
      content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
    };
  }

  private async handleCreateTask(args: any) {
    const task: Task = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('tasks', task);
    return {
      content: [{ type: 'text', text: `Created task: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateTask(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Task>('tasks', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Task with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated task: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteTask(args: any) {
    const deleted = this.db.deleteFromCollection('tasks', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Task with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted task with ID: ${args.id}` }],
    };
  }

  // Component handlers
  private async handleListComponents(args: any) {
    const components = this.db.getCollection<Component>('components');
    const summaries: ComponentSummary[] = components.map(component => ({
      id: component.id,
      name: component.name,
      description: component.description,
      filePath: component.filePath,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetComponents(args: any) {
    if (args.id) {
      const component = this.db.findById<Component>('components', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(component, null, 2) }],
      };
    }
    const components = this.db.getCollection<Component>('components');
    return {
      content: [{ type: 'text', text: JSON.stringify(components, null, 2) }],
    };
  }

  private async handleCreateComponent(args: any) {
    const component: Component = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('components', component);
    return {
      content: [{ type: 'text', text: `Created component: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateComponent(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Component>('components', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `Component with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated component: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteComponent(args: any) {
    const deleted = this.db.deleteFromCollection('components', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `Component with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted component with ID: ${args.id}` }],
    };
  }

  // API handlers
  private async handleListApis(args: any) {
    const apis = this.db.getCollection<Api>('apis');
    const summaries: ApiSummary[] = apis.map(api => ({
      id: api.id,
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      description: api.description,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetApis(args: any) {
    if (args.id) {
      const api = this.db.findById<Api>('apis', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(api, null, 2) }],
      };
    }
    const apis = this.db.getCollection<Api>('apis');
    return {
      content: [{ type: 'text', text: JSON.stringify(apis, null, 2) }],
    };
  }

  private async handleCreateApi(args: any) {
    const api: Api = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('apis', api);
    return {
      content: [{ type: 'text', text: `Created API: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  private async handleUpdateApi(args: any) {
    const { id, ...updates } = args;
    const updated = this.db.updateInCollection<Api>('apis', id, updates);
    if (!updated) {
      throw new McpError(ErrorCode.InvalidRequest, `API with ID ${id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Updated API: ${JSON.stringify(updated, null, 2)}` }],
    };
  }

  private async handleDeleteApi(args: any) {
    const deleted = this.db.deleteFromCollection('apis', args.id);
    if (!deleted) {
      throw new McpError(ErrorCode.InvalidRequest, `API with ID ${args.id} not found`);
    }
    return {
      content: [{ type: 'text', text: `Deleted API with ID: ${args.id}` }],
    };
  }

  // Environment handlers
  private async handleListEnvironment(args: any) {
    const envVars = this.db.getCollection<EnvironmentVariable>('environment');
    const summaries: EnvironmentVariableSummary[] = envVars.map(envVar => ({
      id: envVar.id,
      name: envVar.name,
      description: envVar.description,
      isPublic: envVar.isPublic,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetEnvironment(args: any) {
    if (args.id) {
      const envVar = this.db.findById<EnvironmentVariable>('environment', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(envVar, null, 2) }],
      };
    }
    const envVars = this.db.getCollection<EnvironmentVariable>('environment');
    return {
      content: [{ type: 'text', text: JSON.stringify(envVars, null, 2) }],
    };
  }

  private async handleCreateEnvironment(args: any) {
    const envVar: EnvironmentVariable = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('environment', envVar);
    return {
      content: [{ type: 'text', text: `Created environment variable: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  // Style Guide handlers
  private async handleListStyleGuide(args: any) {
    const patterns = this.db.getCollection<StyleGuidePattern>('style-guide');
    const summaries: StyleGuidePatternSummary[] = patterns.map(pattern => ({
      id: pattern.id,
      element: pattern.element,
      description: pattern.description,
      className: pattern.className,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetStyleGuide(args: any) {
    if (args.id) {
      const pattern = this.db.findById<StyleGuidePattern>('style-guide', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(pattern, null, 2) }],
      };
    }
    const patterns = this.db.getCollection<StyleGuidePattern>('style-guide');
    return {
      content: [{ type: 'text', text: JSON.stringify(patterns, null, 2) }],
    };
  }

  private async handleCreateStyleGuide(args: any) {
    const pattern: StyleGuidePattern = {
      id: this.db.generateId(),
      ...args,
    };
    const created = this.db.addToCollection('style-guide', pattern);
    return {
      content: [{ type: 'text', text: `Created style guide pattern: ${JSON.stringify(created, null, 2)}` }],
    };
  }

  // State Management handlers
  private async handleListState(args: any) {
    const states = this.db.getCollection<StateManagement>('state');
    const summaries: StateManagementSummary[] = states.map(state => ({
      id: state.id,
      library: state.library,
      storeDirectory: state.storeDirectory,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetState(args: any) {
    if (args.id) {
      const state = this.db.findById<StateManagement>('state', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(state, null, 2) }],
      };
    }
    const states = this.db.getCollection<StateManagement>('state');
    return {
      content: [{ type: 'text', text: JSON.stringify(states, null, 2) }],
    };
  }

  // Custom Hooks handlers
  private async handleListHooks(args: any) {
    const hooks = this.db.getCollection<CustomHook>('hooks');
    const summaries: CustomHookSummary[] = hooks.map(hook => ({
      id: hook.id,
      name: hook.name,
      filePath: hook.filePath,
      description: hook.description,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetHooks(args: any) {
    if (args.id) {
      const hook = this.db.findById<CustomHook>('hooks', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(hook, null, 2) }],
      };
    }
    const hooks = this.db.getCollection<CustomHook>('hooks');
    return {
      content: [{ type: 'text', text: JSON.stringify(hooks, null, 2) }],
    };
  }

  // Conventions handlers
  private async handleListConventions(args: any) {
    const conventions = this.db.getCollection<Convention>('conventions');
    const summaries: ConventionSummary[] = conventions.map(convention => ({
      id: convention.id,
      rule: convention.rule,
      description: convention.description,
    }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summaries, null, 2) }],
    };
  }

  private async handleGetConventions(args: any) {
    if (args.id) {
      const convention = this.db.findById<Convention>('conventions', args.id);
      return {
        content: [{ type: 'text', text: JSON.stringify(convention, null, 2) }],
      };
    }
    const conventions = this.db.getCollection<Convention>('conventions');
    return {
      content: [{ type: 'text', text: JSON.stringify(conventions, null, 2) }],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

async function main() {
  const server = new ComponentsMCPServer();
  await server.run();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
  });
}