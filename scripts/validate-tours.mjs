import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const root = process.argv[2] || 'site';
let tours = 0, steps = 0;
for (const lang of ['ru', 'en']) {
  const dir = path.join(root, 'data', lang);
  const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
  const events = new Set(fs.readdirSync(dir).filter(n => /^events-\d+\.json$/.test(n)).flatMap(n => read(n).map(e => e.id)));
  for (const entry of read('tours.json')) {
    const tour = read(`tour-${entry.id}.json`);
    assert.equal(tour.id, entry.id);
    assert.equal(tour.steps.length, entry.steps);
    for (const [i, step] of tour.steps.entries()) {
      assert(Number.isFinite(step.year));
      assert(step.title[lang]?.trim() && step.text[lang]?.trim());
      assert(step.events.length && step.events.every(id => events.has(id)));
      for (const field of ['lat', 'lng', 'altitude', 'zoom']) assert(Number.isFinite(step.camera[field]));
      assert(step.camera.lat >= -90 && step.camera.lat <= 90);
      assert(step.camera.lng >= -180 && step.camera.lng <= 180);
      assert(step.camera.zoom > 0 && step.camera.altitude > 0);
      if (i) assert(step.year >= tour.steps[i - 1].year, `${entry.id}: steps out of order`);
      steps++;
    }
    tours++;
  }
}
console.log(`Validated ${tours} tour files and ${steps} steps.`);
