#!/usr/bin/env node

// Simple test to verify MCP tools are registered correctly
const { spawn } = require('child_process');

console.log('Testing MCP server tool registration...');

const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send ListTools request
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
server.stdin.end();

let output = '';
server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

server.on('close', (code) => {
  console.log('Server process closed with code:', code);
  
  try {
    // Look for response in output
    const lines = output.split('\n').filter(line => line.trim());
    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        if (response.id === 1 && response.result && response.result.tools) {
          const tools = response.result.tools;
          const listTools = tools.filter(tool => tool.name.startsWith('list_'));
          console.log(`\nFound ${tools.length} total tools`);
          console.log(`Found ${listTools.length} list tools:`);
          listTools.forEach(tool => console.log(`  - ${tool.name}`));
          
          if (listTools.length === 13) {
            console.log('\n✅ All 13 list tools are properly registered!');
          } else {
            console.log('\n❌ Missing list tools. Expected 13, found', listTools.length);
          }
          return;
        }
      } catch (e) {
        // Not JSON, continue
      }
    }
    console.log('❌ Could not find tools list in server response');
    console.log('Raw output:', output);
  } catch (error) {
    console.error('Error parsing server response:', error);
    console.log('Raw output:', output);
  }
});

// Timeout after 5 seconds
setTimeout(() => {
  server.kill();
  console.log('❌ Test timed out');
  process.exit(1);
}, 5000);