import { State, DEFAULT_STATE } from './types';
import { validateState } from './validate';

/**
 * Exports current state as a formatted JSON string.
 */
export function exportStateToJson(state: State): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Parses and validates an imported JSON string into a valid State.
 */
export function importStateFromJson(jsonString: string): State {
  try {
    const parsed = JSON.parse(jsonString);
    return validateState(parsed);
  } catch (err) {
    console.error('Failed to parse JSON state:', err);
    return { ...DEFAULT_STATE };
  }
}

/**
 * Creates a download prompt for a JSON file in the browser.
 */
export function downloadJsonFile(content: string, filename: string = 'lifespan-state.json'): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
