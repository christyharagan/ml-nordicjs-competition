import {loadAnswers, loadPremises, clear} from '../server'
import {answers, premises} from './data'

export function loadData(server) {
  return clear(server).then(function() {
    return loadPremises(server, premises)
  }).then(function() {
    console.log('Premises successfully loaded')
    return loadAnswers(server, answers)
  }).then(function() {
    console.log('Answers successfully loaded')
  }).then(function() {
    process.exit()
  }).catch(function(e) {
    console.log(e)
    console.log(e.stack)
    process.exit()
  })
}
