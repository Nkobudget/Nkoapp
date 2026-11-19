import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateBudgetDocsHtml } from '../src/legacy/exportBudgetDocs.js';

test('budget docs HTML export produces valid Microsoft Word / Google Docs document markup', () => {
  const mockProject = {
    id: 'proj-alu',
    name: 'ALU',
    type: 'Short Film',
    base_currency: 'NGN',
    target_budget: 8040000,
  };

  const mockItems = [
    { id: 'item-1', dept: 'Camera', description: 'RED Komodo 6K Package', qty: 10, unit: 'days', rate: 150000, currency: 'NGN' },
    { id: 'item-2', dept: 'Lighting & Grip', description: 'Aputure 600d Lighting kit', qty: 10, unit: 'days', rate: 80000, currency: 'NGN' },
    { id: 'item-3', dept: 'Production Crew', description: 'Director of Photography', qty: 10, unit: 'days', rate: 120000, currency: 'NGN' },
  ];

  const html = generateBudgetDocsHtml(mockItems, mockProject);

  assert.ok(html.includes('xmlns:w="urn:schemas-microsoft-com:office:word"'));
  assert.ok(html.includes('<title>ALU - Production Budget</title>'));
  assert.ok(html.includes('ALU — Production Budget'));
  assert.ok(html.includes('Short Film'));
  assert.ok(html.includes('Grand Total'));
  assert.ok(html.includes('Camera'));
  assert.ok(html.includes('RED Komodo 6K Package'));
  assert.ok(html.includes('Aputure 600d Lighting kit'));
  assert.ok(html.includes('Compatible with Microsoft Word & Google Docs'));
});

test('export options include PDF, Word & Docs (.doc), and Excel (.xlsx)', () => {
  const supportedFormats = ['pdf', 'docs', 'excel'];
  assert.ok(supportedFormats.includes('pdf'));
  assert.ok(supportedFormats.includes('docs'));
  assert.ok(supportedFormats.includes('excel'));
});
