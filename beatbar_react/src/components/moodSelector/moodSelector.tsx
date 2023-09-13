import styles from './styles.module.css'
import {useState} from "react";
import {MOODS} from "../../commons/types";

type MoodSelectorProps = {
  setSelectedMood: Function
  selectedMood: MOODS
}

export default function MoodSelector(props: MoodSelectorProps){
  const [selectedMood, setSelectedMood] = useState<MOODS>(props.selectedMood)
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
                  props.setSelectedMood(MOODS.sad)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.sad}
              </li>
              <li
                className={selectedMood===MOODS.chill?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.chill)
                  props.setSelectedMood(MOODS.chill)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.chill}
              </li>
              <li
                className={selectedMood===MOODS.focused?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.focused)
                  props.setSelectedMood(MOODS.focused)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.focused}
              </li>
              <li
                className={selectedMood===MOODS.happy?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.happy)
                  props.setSelectedMood(MOODS.happy)
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