import "bulma/css/bulma.css"
import "bulma-pageloader"
import "bulma-checkradio"
import "./App.css"

import {h, Fragment} from "preact"
import {useEffect, useState} from "preact/hooks"
import cls from "classnames"

import questions from "../questions.yaml"


export const App = () => {
  const [isDone, setDone] = useState(false)
  const [answers, _setAnswers] = useState({})

  const setAnswers = id => val =>
    _setAnswers(Object.assign({}, answers, {[id]: val}))

  const total = questions
    .filter(x => x.note === undefined)
    .map(x => Object.values(x).flat()
         .filter(y => y.note === undefined)
         .length)
    .reduce((a, b) => a + b, 0);

  const answered = Object.keys(answers).length

  const doSave = () => {
    let match = document.cookie.match(/qkey=([^;]*)/);
    const cookieKey = match ? match[1] : Math.random().toString(36);
    document.cookie = "qkey=" + cookieKey;
    fetch(
      `https://ssh.fish/q/${cookieKey}`,
      { method: "POST",
        mode: "cors",
        credentials: 'omit',
        body: JSON.stringify(answers)
      })
    .then(() => setDone(true))
  }

  return [
    <nav class="navbar is-fixed-top" >
      <progress class="progress is-dark" value={answered} max={total}/>
    </nav>,

    <div class="container is-max-desktop px-2">
      { questions.map(g => {
        const [[key, val]] = Object.entries(g)
        return (key == "note"
          ? <p class="mb-2" dangerouslySetInnerHTML={{__html: val}}></p>
          : <Fragment>
            <h1 class="title">{key}</h1>
            { val.map(q => {
                const [[key, val]] = Object.entries(q)
                return (key == "note"
                  ? <p class="mb-2">{val}</p>
                  : <Question
                      title={key}
                      text={val}
                      value={answers[key]}
                      onChange={setAnswers(key)}
                    />)
            })}
          </Fragment>)
      })}

      <div class="btn-send control mt-6">
        <button
          class="button is-dark is-medium is-fullwidth"
          onClick={doSave}
          disabled={total != answered}
        >
          { total == answered ? "Отправить" : "Нужно больше ответов" }
        </button>
      </div>
    </div>,

    <Bye isActive={isDone}/>
  ];
}


const Question = ({title, text, value, onChange}) =>
  <article class="message">
    <div class="message-body">
      <b>{title}</b>
      <p>{text}</p>
      <div class="control">
        <Answer id={title} value={value} onChange={onChange}/>
      </div>
    </div>
  </article>



const Answer = ({id, value, onChange}) =>
  <div class="columns is-desktop mt-1">
    { [ ["Да",       "is-success"],
        ["Нет",      "is-danger"],
        ["Не важно", "is-warning"],
        ["Не знаю",  "is-info"],
      ].map(([val, color]) =>
        <div class="column">
          <Radio
            isChecked={val == value}
            onChange={() => onChange(val)}
            name={id}
            label={val}
            style={color}
          />
        </div>
      )
    }
  </div>

const Radio = ({isChecked, onChange, style, name, label}) =>
  <label onClick={onChange}>
    <input
      class={cls("is-checkradio", style)} type="radio" name={name}
      checked={isChecked}
      onChange={onChange}
    />
    <label>{label}</label>
  </label>;


const Bye = ({isActive}) => {
  const pageloader = cls(
    "pageloader is-bottom-to-top is-dark",
    {"is-active": isActive}
  )

  return (
    <div class={pageloader}>
      <div class="title">
        <h1>Спасибо! Ваше мнение достаточно важно для нас!</h1>
      </div>
    </div>
  );
}
