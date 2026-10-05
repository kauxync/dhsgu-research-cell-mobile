const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default || require('@babel/traverse');

const errors = [];
const warnings = [];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles('.');
console.log(`Found ${allFiles.length} JS/JSX files to inspect.`);

const registeredRoutes = new Set();
const navigationCalls = [];

const commonRNComponents = [
  'View', 'Text', 'TouchableOpacity', 'ScrollView', 'FlatList', 
  'TextInput', 'Modal', 'Image', 'ActivityIndicator', 'Pressable', 
  'KeyboardAvoidingView', 'SafeAreaView', 'StatusBar', 'Switch', 'SectionList', 'Alert'
];

for (const file of allFiles) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'objectRestSpread', 'optionalChaining', 'nullishCoalescingOperator']
    });
  } catch (err) {
    errors.push({ file, type: 'SYNTAX_ERROR', message: err.message });
    continue;
  }

  const imports = new Set();
  const definedIdentifiers = new Set();
  const rnImports = new Set();

  traverse(ast, {
    ImportDeclaration(p) {
      const source = p.node.source.value;
      p.node.specifiers.forEach(spec => {
        imports.add(spec.local.name);
        if (source === 'react-native') {
          rnImports.add(spec.local.name);
        }
      });
    },
    VariableDeclarator(p) {
      if (p.node.id.type === 'Identifier') {
        definedIdentifiers.add(p.node.id.name);
      }
    },
    FunctionDeclaration(p) {
      if (p.node.id) definedIdentifiers.add(p.node.id.name);
    },
    JSXOpeningElement(p) {
      let name = null;
      if (p.node.name.type === 'JSXIdentifier') {
        name = p.node.name.name;
      } else if (p.node.name.type === 'JSXMemberExpression') {
        name = `${p.node.name.object.name}.${p.node.name.property.name}`;
      }

      if (name && commonRNComponents.includes(name)) {
        if (!rnImports.has(name) && !imports.has(name) && !definedIdentifiers.has(name)) {
          errors.push({ file, type: 'MISSING_RN_IMPORT', message: `JSX element <${name}> is used at line ${p.node.loc?.start?.line} but not imported from react-native!` });
        }
      }

      if (name === 'Stack.Screen' || name === 'Tab.Screen' || (p.node.name && p.node.name.property && p.node.name.property.name === 'Screen')) {
        const nameAttr = p.node.attributes.find(a => a.name && a.name.name === 'name');
        if (nameAttr && nameAttr.value && nameAttr.value.value) {
          registeredRoutes.add(nameAttr.value.value);
        }
      }
    },
    CallExpression(p) {
      if (p.node.callee && p.node.callee.property && (p.node.callee.property.name === 'navigate' || p.node.callee.property.name === 'push')) {
        if (p.node.arguments.length > 0 && p.node.arguments[0].type === 'StringLiteral') {
          navigationCalls.push({ file, route: p.node.arguments[0].value, line: p.node.loc?.start?.line });
        }
      }
    }
  });
}

const knownRoutes = [
  'Login', 'Register', 'RoleSelect', 'StudentMain', 'ScholarMain', 'ProfessorMain',
  'StudentTabs', 'ScholarTabs', 'ProfessorTabs', 'StudentHome', 'ScholarHome', 'ProfessorHome',
  'Chatbot', 'StudentChatbot', 'ScholarChatbot', 'ProfessorChatbot',
  'Settings', 'EditProfile', 'ThemeSettings', 'AppInfo', 'ResearchPolicies',
  'StudentDigest', 'StudentPapers', 'StudentMentors', 'StudentFunding',
  'ScholarProjects', 'ScholarPublications', 'ScholarEquipment', 'ScholarCollaboration',
  'ProfessorSubmissions', 'ProfessorGrants', 'ProfessorScholars', 'ProfessorAnalytics',
  'Home', 'Digests', 'Mentors', 'Projects', 'Publications', 'Equipment', 'Submissions', 'Grants', 'Analytics'
];

knownRoutes.forEach(r => registeredRoutes.add(r));

for (const nav of navigationCalls) {
  if (!registeredRoutes.has(nav.route)) {
    warnings.push({ file: nav.file, type: 'UNRESOLVED_ROUTE', message: `navigation.navigate("${nav.route}") at line ${nav.line} is not registered in known navigation stack/tabs.` });
  }
}

console.log(`\n================ INSPECTION RESULTS ================`);
console.log(`Total Files Checked: ${allFiles.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('--- ERRORS ---');
  errors.forEach(e => console.log(`[${e.type}] ${e.file}: ${e.message}`));
} else {
  console.log('✓ 0 Syntax Errors');
  console.log('✓ 0 Missing React Native / JSX Imports');
}

if (warnings.length > 0) {
  console.log('\n--- WARNINGS ---');
  warnings.forEach(w => console.log(`[${w.type}] ${w.file}: ${w.message}`));
} else {
  console.log('✓ 0 Unresolved Navigation Routes');
}
