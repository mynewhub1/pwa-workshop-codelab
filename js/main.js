/*
 Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
 import { openDB } from 'idb';

// Set up the database
const db = await openDB('settings-store', 1, {
  upgrade(db) {
    db.createObjectStore('settings');
  },
});
window.addEventListener('DOMContentLoaded', async () => {
  // Set up the editor
  const { Editor } = await import('./app/editor.js');
  const editor = new Editor(document.body);

  // Set up the menu
  const { Menu } = await import('./app/menu.js');
  new Menu(document.querySelector('.actions'), editor);

  // Set the initial state in the editor
  const defaultText = `# Welcome to PWA Edit!\n\nTo leave the editing area, press the \`esc\` key, then \`tab\` or \`shift+tab\`.`;

// Save content to database on edit
editor.onUpdate(async (content) => {
  await db.put('settings', content, 'content');
});
editor.setContent((await db.get('settings', 'content')) || defaultText);

// Set up night mode toggle
const { NightMode } = await import('./app/night-mode.js');
new NightMode(
  document.querySelector('#mode'),
  async (mode) => {
    editor.setTheme(mode);
    
    // Save the night mode setting when changed

  },
  // Retrieve the night mode setting on initialization
);
});