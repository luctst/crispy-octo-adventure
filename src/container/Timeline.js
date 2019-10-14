import React, {useState, useEffect} from "react";
import Event from "../components/Event";
import Filters from './Filters';

function Timeline() {
  const [state, setState] = useState({
      data: null
  })

  useEffect(() => {
    fetch(`https://spreadsheets.google.com/feeds/list/${process.env.REACT_APP_KEY}/1/public/values?alt=json`)
    .then(response => response.json())
    .then(dataParsed => {
      const newState = dataParsed.feed.entry;
      console.log(newState[1]);
      setState({data: newState});
    })
    console.log(state.data);
  }, []);

  return(
    <React.Fragment>
      <Filters data={state.data} />
      {state.data === null ? "loading" :
       state.data.map((event, index) => {
        return (
          <div className="main--left--element" key={index}>
            <Event gsx$date={event.gsx$date} gsx$title={event.gsx$title} gsx$description={event.gsx$description} gsx$category={event.gsx$category} key={index} />
         </div>
        )
      })
    }
    </React.Fragment>
  )
}

export default Timeline