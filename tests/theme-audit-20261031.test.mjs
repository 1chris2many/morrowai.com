import {test} from 'node:test';
import assert from 'node:assert/strict';
import {briefs} from '../scripts/theme-current.mjs';
import {auditRevision,beforeAuditRevision} from './theme-name-history.mjs';
import {audioHash} from '../scripts/brief-audio.mjs';
const brief=id=>briefs.find(b=>b.id===id);
const development=(id,source)=>brief(id).developments.find(d=>d.id===source);

test('audited copy normalization preserves unexpected factual edits as failures',()=>{
  assert.equal(Object.keys(auditRevision.changes).length,3);
  for(const [id,{before,after}] of Object.entries(auditRevision.changes)){
    assert.deepEqual(brief(id),after,id);
    assert.deepEqual(beforeAuditRevision(after),before,id);
    assert.equal(after.author,before.author,id+':author');
    for(const field of ['reviewedAt','summary','title']){
      const unexpected={...after,[field]:after[field]+' unreviewed change'};
      assert.equal(beforeAuditRevision(unexpected),unexpected,id+':'+field);
    }
    assert.notEqual(audioHash(before),audioHash(after),id+':changed narration requires new recording');
    for(const old of before.developments){
      const current=after.developments.find(d=>d.id===old.id);
      assert.ok(current,id+':preserve source '+old.id);
      assert.equal(current.date,old.date,id+':preserve event date '+old.id);
      assert.equal(current.url,old.url,id+':preserve source URL '+old.id);
      if(old.primaryUrl)assert.equal(current.primaryUrl,old.primaryUrl,id+':preserve primary URL '+old.id);
    }
  }
  assert.deepEqual(Object.entries(auditRevision.changes).filter(([,c])=>c.before.reviewedAt!==c.after.reviewedAt).map(([id])=>id).sort(),['chip-switching']);
});

test('robot headline does not turn one study into a general rescue or failure-rate claim',()=>{
  const b=brief('robot-transfer');
  assert.doesNotMatch(b.title,/rescu|nearly half|44%|56%/i);
  assert.equal(b.metric.sourceId,814);
  assert.equal(b.metric.value,'56%');
  assert.match(b.metric.context,/Figure/);
  assert.match(b.metric.context,/30 homes/);
  assert.match(b.metric.context,/safety intervention counted as a failure/);
  assert.match(b.timelineIntro,/different tests/);
  assert.match(b.timelineIntro,/cannot be ranked/);
  assert.ok(b.developments.some(d=>d.id===997));
});

test('market share metric remains intelligible in spoken narration',()=>{
  assert.equal(brief('ai-market-leadership').metric.value,'54.1% to 52.2%');
});
