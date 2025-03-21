import {useEffect, useRef, useState } from "react";
import styles from "./Select.module.css";

export type selectOption = {
  label: string;
  value: string | number;
};
type SingleSelectProps = {
  multiple?: false;
  value?: selectOption;
  onChange: (value: selectOption | undefined) => void;
};

type MultiSelectProps = {
  multiple: true;
  value: selectOption[];
  onChange: (value: selectOption[]) => void;
};

type selectProps = {
  options: selectOption[];
} & (SingleSelectProps | MultiSelectProps);

export function Select({ multiple, value, onChange, options }: selectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlitedIndex, setHighlitedIndex] = useState(0);

const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {multiple ? onChange([]) : onChange(undefined);}

  function selectOption(option: selectOption) {
    if (multiple) {if (value.includes(option)) {onChange(value.filter((v) => v !== option));
                    } else {onChange([...value, option]);}
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: selectOption) {
    return multiple ? value.includes(option) :  value === option;
  }

  useEffect(() => {if (isOpen) setHighlitedIndex(0);}, [isOpen]);

  useEffect(() => {

    const handler = (e:KeyboardEvent) =>{
        if (e.target != containerRef.current)return;
        switch(e.code){
            case "Enter":
            case "Space":
                setIsOpen(prev => !prev );
                if (isOpen) selectOption(options[highlitedIndex]);
                break
            case "ArrowUp":
            case "ArrowDown":{
                if (!isOpen) {
                    setIsOpen(true);
                    break;
                }
                const newValue = highlitedIndex + (e.code === "ArrowUp" ? -1 : 1);
                if (newValue >= 0 && newValue < options.length) {setHighlitedIndex(newValue);}
                break
            }
            case "Escape":
                setIsOpen(false);
            

            
        }
    }
        containerRef.current?.addEventListener("keydown", handler);
    return () => {
        containerRef.current?.removeEventListener("keydown", handler);
        }
  }, [isOpen, highlitedIndex,options]);

  return (
    <>
      <div
       ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        className={styles.container}
      >
        <span className={styles.value}>
            {multiple ? value.map(v=> (
                <button key={v.value} onClick={e =>{
                    e.stopPropagation;
                    selectOption(v)
                }}
                className={styles["option-badge"]}

                >{v.label} <span className={styles["remove-btn"]}>&times;</span></button>)) : value?.label}</span>
        <button 
        onClick={(e) => {e.stopPropagation();clearOptions();
          }}
          className={styles["clear-btn"]}
        >
          &times;
        </button>
        <div className={styles.divider}></div><div className={styles.caret}></div>

       <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>

            
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlitedIndex(index)}
              key={option.value}
              className={
                `   ${styles.option} 
                    ${isOptionSelected(option) ? styles.selected : ''}
                    ${index == highlitedIndex ? styles.highlighted : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
