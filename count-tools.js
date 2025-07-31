const tools = [
  'list_units', 'get_units', 'create_unit', 'update_unit', 'delete_unit',
  'list_lessons', 'get_lessons', 'create_lesson', 'update_lesson', 'delete_lesson',
  'list_lesson_phases', 'get_lesson_phases', 'create_lesson_phase', 'update_lesson_phase', 'delete_lesson_phase',
  'list_app_connections', 'get_app_connections', 'create_app_connection', 'update_app_connection', 'delete_app_connection',
  'list_assessments', 'get_assessments', 'create_assessment', 'update_assessment', 'delete_assessment',
  'list_tasks', 'get_tasks', 'create_task', 'update_task', 'delete_task',
  'list_components', 'get_components', 'create_component', 'update_component', 'delete_component',
  'list_apis', 'get_apis', 'create_api', 'update_api', 'delete_api',
  'list_environment', 'get_environment', 'create_environment',
  'list_style_guide', 'get_style_guide', 'create_style_guide',
  'list_state', 'get_state',
  'list_hooks', 'get_hooks',
  'list_conventions', 'get_conventions'
];

console.log('Total tools expected:', tools.length);
console.log('List tools:', tools.filter(t => t.startsWith('list_')).length);
console.log('CRUD tools:', tools.filter(t => !t.startsWith('list_')).length);
console.log('Actual tools from server: 52');
console.log('Difference:', 52 - tools.length, '(likely due to missing create_assessment typo)');