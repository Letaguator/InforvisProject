import React from 'react'
import { Sidebar } from './Sidebar';
import InteractionCountGraph  from './InteractionCountGraph';
import TimelineComp from './TimelineComp';
import './home.css';
import TimelineChart from './TimelineChart';
import Top10Graph from './Top10Graph';
export const Home = () => {
  return (
    <div className='home'>
        <Sidebar/>
        <div className='home-container'>
            <TimelineChart/>
            <div className='inner-home-container'>
            <div className='widgets'>
                <InteractionCountGraph 
                title="Interaction Count"
                />
                <Top10Graph/>
            </div>
            </div>
            
        </div>
    </div>
  )
}
