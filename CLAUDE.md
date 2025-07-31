# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for managing curriculum, components, APIs, and educational content. The project provides tools for Claude Code to interact with educational project knowledge bases through the MCP protocol.

## Architecture

Based on the README, this is an MCP server implementation that:
- Uses stdio transport for MCP communication
- Provides 30+ tools for CRUD operations on curriculum data
- Stores data in `data/db.json` with structured JSON format
- Implements TypeScript interfaces for type safety
- Serves 14 resource endpoints for data access

Key data models include:
- **Curriculum**: Units, Lessons, LessonPhases, AppConnections, Assessments, Tasks
- **Components**: Reusable UI components with file paths and usage examples
- **APIs**: Endpoint documentation with request/response schemas
- **Environment**: Environment variable documentation
- **Style Guide**: Design system patterns and CSS classes
- **State Management**: Global state management strategies
- **Custom Hooks**: Reusable React hooks documentation
- **Conventions**: Coding standards and linting rules

## Common Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build TypeScript
npm run build
```

## MCP Integration

This server is designed to be used with Claude Code via MCP configuration:

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

## Data Storage

All project data is persisted in `data/db.json` with this structure:
- components, apis, environment, style-guide, state, hooks, conventions
- units, lessons, lessonPhases, appConnections, assessments, tasks

## Requirements

- Node.js 14+
- Claude Code (for MCP integration)

## Implementation Details

The MCP server is fully implemented with:
- **30+ MCP Tools**: Complete CRUD operations for all data types
- **14 MCP Resources**: All resource endpoints implemented
- **TypeScript**: Full type safety with proper interfaces
- **JSON Database**: File-based persistence in `data/db.json`
- **Executable Binary**: Ready for npx usage

## Available Tools

**Curriculum (18 tools):**
- Units: get_units, create_unit, update_unit, delete_unit
- Lessons: get_lessons, create_lesson, update_lesson, delete_lesson
- Lesson Phases: get_lesson_phases, create_lesson_phase, update_lesson_phase, delete_lesson_phase
- App Connections: get_app_connections, create_app_connection, update_app_connection, delete_app_connection
- Assessments: get_assessments, create_assessment, update_assessment, delete_assessment
- Tasks: get_tasks, create_task, update_task, delete_task

**Other Tools (12+ tools):**
- Components: get_components, create_component, update_component, delete_component
- APIs: get_apis, create_api, update_api, delete_api
- Environment: get_environment, create_environment
- Style Guide: get_style_guide, create_style_guide
- State: get_state
- Hooks: get_hooks
- Conventions: get_conventions