import "bulma/css/bulma.css"
import "bulma-pageloader"
import "bulma-checkradio"
import "./App.css"

import {h, Fragment} from "preact"
import {useEffect, useState} from "preact/hooks"
import cls from "classnames"

const groups = [
  { group: "Анонимность",
    questions: [
      { id: "q1",
        title: "Вопрос1",
        text: "Вопрос1"
      },
      { id: "q2",
        title: "Вопрос2",
        text: "Вопрос2"
      },
      { id: "q3",
        title: "Вопрос3",
        text: "Вопрос3"
      },
    ]
  },
  { group: "Отслеживаемость",
    questions: [
      { id: "r1",
        title: "Вопрос1",
        text: "Вопрос1"
      },
      { id: "r2",
        title: "Вопрос2",
        text: "Вопрос2"
      },
      { id: "r3",
        title: "Вопрос3",
        text: "Вопрос3"
      },
    ]
  }
]


export const App = () => {
  const [isDone, setDone] = useState(false)
  const [answers, _setAnswers] = useState({})

  const setAnswers = id => val =>
    _setAnswers(Object.assign({[id]: val}, answers))

    const total = groups
      .map(({questions}) => questions.length)
      .reduce((a, b) => a + b, 0);

    const answered = Object.keys(answers).length

  return [
    <nav class="navbar is-fixed-top" >
      <progress class="progress is-dark" value={answered} max={total}/>
    </nav>,

    <div class="container is-max-desktop">
      { groups.map(({group, questions}) =>
        <div>
          <h1 class="title">{group}</h1>
          { questions.map(({id, title, text}) =>
              <Question
                id={id}
                title={title}
                text={text}
                value={answers[id]}
                onChange={setAnswers(id)}
              />
            )
          }
        </div>)
      }

      <div class="btn-send control mt-6">
        <button
          class="button is-dark is-medium is-fullwidth"
          onClick={() => setDone(true)}
        >
          Отправить
        </button>
      </div>
    </div>,

    <Bye isActive={isDone}/>
  ];
}


const Question = ({id, title, text, value, onChange}) =>
  <article class="message">
    <div class="message-header">
      <p>{title}</p>
    </div>
    <div class="message-body">
      {text}
      <div class="control">
        <Answer id={id} value={value} onChange={onChange}/>
      </div>
    </div>
  </article>



const Answer = ({id, value, onChange}) =>
  <div class="columns is-desktop mt-1">
    { [ ["Да",       "is-success"],
        ["Нет",      "is-danger"],
        ["Не важно", "is-warning"],
        ["Не знаю",  "is-info"]
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
        <h1>Спасибо! Ваше мнение важно для нас!</h1>
      </div>
    </div>
  );
}
