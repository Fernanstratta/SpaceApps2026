import assert from 'node:assert/strict';
import test from 'node:test';
import { getLunarAnalog, lunarAnalogIndex } from '../server/lunarAnalogs.js';

test('the lunar catalog exposes all five pairs with nine axes and a consistent summary', () => {
  assert.deepEqual(lunarAnalogIndex.map(pair => pair.pair_id), [
    'elegante_linne', 'pinacate_marius', 'cerro_prieto_gruithuisen',
    'laguna_salada_tranquillitatis', 'cucapa_shackleton',
  ]);

  for (const summary of lunarAnalogIndex) {
    const pair = getLunarAnalog(summary.pair_id);
    assert.ok(pair);
    assert.equal(pair.earth_site.body, 'earth');
    assert.equal(pair.moon_site.body, 'moon');
    assert.deepEqual(pair.axes.map(axis => axis.id), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual(pair.ils, summary.ils);
    assert.equal(pair.earth_site.site_id, summary.earth_site.site_id);
    assert.equal(pair.moon_site.site_id, summary.moon_site.site_id);

    const available = pair.axes.filter(axis => axis.available);
    const weight = (axes: typeof pair.axes) => axes.reduce((sum, axis) => sum + axis.weight, 0);
    assert.equal(pair.ils.axes_used, available.length);
    assert.equal(pair.ils.data_completeness, Number((weight(available) / weight(pair.axes)).toFixed(4)));
    for (const axis of pair.axes) {
      const usable = [axis.earth, axis.moon].every(side => side !== null && side.status !== 'placeholder');
      assert.equal(axis.available, usable);
      assert.equal(axis.similarity !== null, usable);
      assert.ok(axis.source_plan.earth.trim());
      assert.ok(axis.source_plan.moon.trim());
    }
  }
});

test('the aggregate uses only scored axes and reports an empty result when none qualify', () => {
  for (const summary of lunarAnalogIndex) {
    const pair = getLunarAnalog(summary.pair_id);
    assert.ok(pair);
    const scored = pair.axes.filter(axis => axis.similarity !== null);
    const containsProvisionalValue = pair.axes.some(axis =>
      axis.earth?.status === 'placeholder' || axis.moon?.status === 'placeholder');
    assert.equal(pair.ils.has_placeholders, containsProvisionalValue);

    if (scored.length === 0) {
      assert.equal(pair.ils.value, null);
    } else {
      const weightedSum = scored.reduce((sum, axis) => sum + axis.similarity! * axis.weight, 0);
      const weight = scored.reduce((sum, axis) => sum + axis.weight, 0);
      assert.ok(pair.ils.value !== null);
      // Individual axis scores and the final aggregate are rounded independently.
      assert.ok(Math.abs(pair.ils.value - weightedSum / weight) <= 0.1001);
    }
  }
});
