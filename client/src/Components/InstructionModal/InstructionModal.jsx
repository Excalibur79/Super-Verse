import React from "react";
import "./InstructionModal.scss";
import cancel from "../../assets/icons/cancel.png";
import gameverse from "../../assets/images/gameverse.jpeg";
import auction from "../../assets/images/auction.jpeg";
import duel from "../../assets/images/duel1.jpeg";


const InstructionModal=({setfalse})=>
{
    return(
            <div className="InstructionModal fade-in">
               <div className="Rule_heading">
                    <div>Rules and Instructions</div>
                    <img src={cancel} className="animated-button" onClick={setfalse}/>
               </div>
               <div className="Scrollable_Content">
                   <section className="GameVerse_Rules margin-top-small margin-bottom-small"> 
                        <h1 className="margin-bottom-small">GAMEVERSE</h1>
                        <div>
                            <img src={gameverse}/>
                            <div className="Rules_Content">
                                <h1>Create</h1>
                                <p>Create tournament by selecting any of the two universes and number of players</p>
                                <h1>Join</h1>
                                <p>Get the Tournament Id from your Friends and Join an existing Tournament By Selecting the universe and pasting the tournament Id.</p>
                            </div>
                        </div>
                       
                   </section>
                   <section className="Auction_Rules margin-top-small">
                        <h1>AUCTION RULES </h1>
                        <div>
                            <div>
                                <h1>Auction Facts</h1>
                                <p>
                                Auction is one of the most important part of this Tournament! Spend your ingame money wisely!! You are initially given $30,000,000 along with your friends.
                                    Bid with the Slider to pay a higher price than the current price of the character.
                                    <span>Note: There is a Time Limit of 15secs, You must Bid before the timer Runs Out.</span>
                                   
                                </p>
                            </div>
                            <div>
                                <img src="https://res.cloudinary.com/drolmjcot/image/upload/q_auto:best/v1613202973/Super_Verse_-_Google_Chrome_2_12_2021_11_26_27_PM-01-01_1_nkkfb5.jpg"/>
                            </div>
                        </div>
                        <div style={{"textAlign":"left",color:"green"}}>
                            Once You Buy the Character Your deck will be updated with the character which you can use in the battle!
                            Note : Some Cards can transform (specially all Saiyans), Transformable Cards are marked with gold
                                 Point in the upper Right hand Corner of the Card. Different Transformable Cards has different number of transformation chains and Perks.
                                 To Check the next Transformation Perks before transforming, hover over the Character's Attributes (Attack,Defence,Health) to get a glimpse of what you are spending money or ability Points On.
                        </div>
                        <h1>Auction End Conditions</h1>
                        <ul style={{textAlign:"left",fontWeight:"bold"}}>
                                     <li>You can Skip a character by mutually agreeing with friends over phone, and also Vote to end Auction.</li>
                                     <li>When all members have Voted to End the Auction ,The Auction will End.</li>
                                     <li>No Character has a base Price below $1000000 ,So if all participants ends up with acc bal less than $1000000 ,Auction will alse End.</li>
                                     <li>The Database has (DragonBall - 93) Cards(excluding transformable ones) ,if you guys end up reaching the last card,the Auction will also End!</li>
                        </ul>
                   </section>

                   <section className="Duel_Rules margin-top-small">
                       <h1 className="margin-bottom-small">DUEL RULES</h1>
                       <div className="Duel_Image_div">
                           <img src="https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1613202461/Super_Verse_-_Personal_-_Microsoft_Edge_2_12_2021_11_46_44_PM_iofbf4.png" className="Duel_Image"/>
                       </div>
                       <div className="one">
                           <ul>
                               <li>Each Move in Duel will have a particular player attacking and his/her opponent will have to Defend his zone health</li>
                               <li>The Next Move will have the moves <strong>reversed</strong></li>
                               <li>Only The player Defending in that move will have his/her health decreased ,the attacking card will recieve no damage in its round</li>
                               <li>The attacking Card's Stamina will decrease By 1 pts in its Round,while the Cards(From your Deck) that are not placed in your attacking Move will get its Stamina Regenarated By 1 pt.</li>
                               <li>The damage dealt by the attacking card on the defending card will depend on how powerful the atacking card is relative to the defending card in that Round.</li>
                               
                               <li>The Damage Formula is : ((Attack pts of attacking card)/(defence pts of defending card)) * 20</li>
                               <li>The Damage Given By the attacking Card is also affected if its Stamina is below its Stamina Threshold.</li>
                               <li>The Damage given by the attacking Card decreases by (0.1 * (stamina threshold - stamina)) of the original damage if it has its stamina lower than its Threshold.</li>
                               <li>The Damage Recieved By the defending Card is also affected if its Stamina is below its Threshold.</li>
                               <li>The Damage Recieved by the defending Card increases by (0.1 * (stamina threshold - stamina)) of the final damage given by the attacking card if it has its stamina lower than its Threshold.</li>

                               <li>Damage Recieved by the Defending Player = Damage Recieved By his defending Card in that Round</li>
                               <li>If Damage Recieved is less than 16 , then the defending player will Gain 1 Ability Point</li>
                               <li>Ability Points Can be used to transform a transformable Character</li>
                               <li>To use an Ability Point , once you gain an ability point , select a transformable character from your deck (If You Have one ofc!) then click on the gold point button on the upper right corner of your screen! </li>
                               <li>Transformable Cards have the potential of health restoration by 25 hp and Stamina Regenaration of 3pts. It will have its attack and defence increased too.</li>
                               <li>Once You have at least 3 Ability Pts, You'll Recieve Chakra/Senzu Bean . Use this to restore any character's health by 25 hp and have its stamina totally Restored!</li>
                               <li>Senzu Beans / Chakra consumes all the 3 ability Points!</li>
                               <li>The Player who dies first will lose!</li>
                               <li>Two Players tournament will have two duels</li>
                               <li>Four Players tournament will have three duels due to Tournament Tree.</li>
                               <li>In Four Players Tournament once the first level battles are over ,First Level battle Winners will be redirected to the final match</li>
                               
                           </ul>
                       </div>

                       <div className="Two">
                         <h1 className="margin-bottom-small">Some Facts</h1>
                         <h1 style={{color:"green",textAlign:"left",margin:"1rem"}}>The Database has Nearly 273 Characters (DragonBall + Naruto) including all the Transformations!</h1>
                         <h1 style={{color:"green",textAlign:"left",margin:"1rem"}}>This Page has a playlist of all the popular Songs of Both DragonBall and Naruto. Click the GameVerse Icons alternately to Surf through the playlist! </h1>

                       </div>

                       <div className="Two margin-top-large ">
                            <h1 style={{color:"red",textAlign:"left",margin:"1rem"}}>*You Must have a Stable Internet Connection to Play this Game.</h1>
                            <h1 style={{color:"red",textAlign:"left",margin:"1rem"}} className=" margin-top-small" >*Don't refresh the Page during Tournament,which will cause cancellation of the Tournament!</h1>
                            <h1 style={{color:"red",textAlign:"left",margin:"1rem"}} className=" margin-top-small" >*NarutoVerse is Still in Development!</h1>
                       </div>
                   </section>
               </div>
            </div>
    )
}
export default InstructionModal;