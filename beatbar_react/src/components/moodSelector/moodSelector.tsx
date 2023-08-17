import styles from './styles.module.css'
import {useState} from "react";
import {MOODS} from "../../types";

export default function MoodSelector(){
  const [selectedMood, setSelectedMood] = useState<MOODS>(MOODS.focused)
  const [selectionExpanded, setSelectionExpanded]=useState(false)

  return (
    <div className={styles.moodSelector}>
      <div
        onClick={()=>{setSelectionExpanded(true)}}
      >mood:</div>
      <div>
        {
          selectionExpanded?
            <ul className={styles.moodSelectorOption}>
              <li
                className={selectedMood===MOODS.sad?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.sad)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.sad}
              </li>
              <li
                className={selectedMood===MOODS.chill?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.chill)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.chill}
              </li>
              <li
                className={selectedMood===MOODS.focused?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.focused)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.focused}
              </li>
              <li
                className={selectedMood===MOODS.happy?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.happy)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.happy}
              </li>
            </ul>:
            <div onClick={()=>{setSelectionExpanded(true)}} className={styles.moodSelectorSelected}>{selectedMood}</div>
        }
      </div>
    </div>
  )
}