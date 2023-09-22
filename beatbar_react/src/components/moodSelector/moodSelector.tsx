import styles from './styles.module.css'
import {useEffect, useState} from "react";
import {MOODS} from "../../commons/types";
import {handleSetSelectedMood, updateMoodInCookie} from "../cookieController";
import {setMood} from "../backendController";

type MoodSelectorProps = {
  selectedMood: MOODS,
  updateMood: Function,
  uuid: string,
  setCurrentPlaylist: Function,
  setSelectedMood: Function,
  setPlaylistLoading: Function
}

export default function MoodSelector(props: MoodSelectorProps){
  const [selectedMood, setSelectedMood] = useState<MOODS>(props.selectedMood)
  const [selectionExpanded, setSelectionExpanded]=useState(false)

  useEffect(()=>{
    console.log("i would like to post now: ", selectedMood)
    props.updateMood(selectedMood)
    updateMoodInCookie(selectedMood)
  }, [selectedMood])

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
                  //props.handleSetSelectedMood(props.uuid, MOODS.sad, props.selectedMood, props.setCurrentPlaylist, props.setSelectedMood, props.setPlaylistLoading)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.sad}
              </li>
              <li
                className={selectedMood===MOODS.relaxed?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.relaxed)
                  props.setSelectedMood(MOODS.relaxed)
                  //props.handleSetSelectedMood(props.uuid, MOODS.relaxed, props.selectedMood, props.setCurrentPlaylist, props.setSelectedMood, props.setPlaylistLoading)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.relaxed}
              </li>
              <li
                className={selectedMood===MOODS.aggressive?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.aggressive)
                  props.setSelectedMood(MOODS.aggressive)
                  //props.handleSetSelectedMood(props.uuid, MOODS.aggressive, props.selectedMood, props.setCurrentPlaylist, props.setSelectedMood, props.setPlaylistLoading)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.aggressive}
              </li>
              <li
                className={selectedMood===MOODS.happy?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.happy)
                  props.setSelectedMood(MOODS.happy)
                  //props.handleSetSelectedMood(props.uuid, MOODS.happy, props.selectedMood, props.setCurrentPlaylist, props.setSelectedMood, props.setPlaylistLoading)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.happy}
              </li>
              <li
                className={selectedMood===MOODS.party?styles.moodSelectorOptionSelected:styles.moodSelectorOptionUnselected}
                onClick={()=>{
                  setSelectedMood(MOODS.party)
                  props.setSelectedMood(MOODS.party)
                  //props.handleSetSelectedMood(props.uuid, MOODS.party, props.selectedMood, props.setCurrentPlaylist, props.setSelectedMood, props.setPlaylistLoading)
                  setSelectionExpanded(false)
                }
              }>
                {MOODS.party}
              </li>
            </ul>:
            <div onClick={()=>{setSelectionExpanded(true)}} className={styles.moodSelectorSelected}>{props.selectedMood}</div>
        }
      </div>
    </div>
  )
}