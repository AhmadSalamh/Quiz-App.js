let countSpan = document.querySelector('.count span'),
    bullets=document.querySelector('.bullets'),
    bulletsSpanContainer=document.querySelector('.bullets .spans'),
    quizArea = document.querySelector('.quiz-area'),
    answersArea=document.querySelector('.answer-area'),
    submitButton=document.querySelector('.submit-button'),
    resulesCountainer=document.querySelector('.resluts'),
    countDownElement=document.querySelector('.countdown');

// Set options
let currentIndex=0,
    rightAnswer=0,
    countDownInterval;

function getQuestion(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange=function () {

        if(this.readyState === 4 & this.status ===200){

           let questonObject= JSON.parse(this.response);
        
           let qCount=questonObject.length;

            //create Bullets + Set Qustions Count
            createBullets(qCount)

            //Add Question Data
            addQustionData(questonObject[currentIndex],qCount);

            //Start countDown
            countDown(60,qCount)

            //click on submit
            submitButton.onclick=function () {

                // Get Rigth answer
                let theRightAnswwer=questonObject[currentIndex].right_answer;

                //Increase Index
                currentIndex++;

                // Cheek the Answer
                cheekAnswer(theRightAnswwer,qCount);

                // Remove Previous Qustion
                quizArea.innerHTML='';
                answersArea.innerHTML='';

                //Add Question Data
                addQustionData(questonObject[currentIndex],qCount);
              
                //Handle Bullets Class
                handleBullets()

                //Start CountDwon
                clearInterval(countDownInterval)
                countDown(60, qCount)

                //show Results
                showResults(qCount)
              }
         }
    }

    myRequest.open('Get',"html_question.json");
    myRequest.send()
}
getQuestion()

function createBullets(num){
    countSpan.innerHTML=num;

    // Create Spans
    for(let i=0 ;i<num ;i++){

        //Create Bullet
        let theBullet=document.createElement('span')

        if(i === 0){

            theBullet.classList.add('on')
        }
   
        //Append Bullets To MainBulltes Contianer
        bulletsSpanContainer.appendChild(theBullet)
    }   
}

function addQustionData(obj,count){

    if(currentIndex < count){
        //Create H2 Question title
        let questionTitle=document.createElement('h2'),

            //Create Question Text
            questionText=document.createTextNode(obj['title']);

        questionTitle.appendChild(questionText);

        quizArea.appendChild(questionTitle)

    //create the Answers
    for(let i=1;i<=4;i++){
       // create Main Answer Div
        let mainDiv=document.createElement('div');
        
            // add Class To main Div
            mainDiv.className='answer';

        // Create Radio Input
        let radioInput=document.createElement('input');

        //Add type + Name + Id + Data-Attribute
            radioInput.name='question'
            radioInput.type='radio'
            radioInput.id= `answer-${i}`;
            radioInput.dataset.answer= obj[`answer-${i}`];

            //Make Frist Option Selected
            if(i ===1){
                radioInput.checked=true
            }
        // create Lable
        let theLabel = document.createElement('label');
        
        // Add For Attribute
        theLabel.htmlFor= `answer-${i}`

        // Create lable Text
        let theLabelText =document.createTextNode(obj[`answer-${i}`])
        
        //Add the text to lable
        theLabel.appendChild(theLabelText)

        // add input + lable to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        
        // Append All Divs To Answers Area
        answersArea.appendChild(mainDiv)
    }
  }
   
}

function cheekAnswer (rAnswer,count){

    let answers = document.getElementsByName('question');
    let theChoosenAnswer;

    for(let i = 0 ; i<answers.length; i++){

        if(answers[i].checked){

            theChoosenAnswer=answers[i].dataset.answer;
        }
    }
 
    if(rAnswer ===theChoosenAnswer){
        rightAnswer++;
    }
}

function handleBullets(){
    let bulletsSpan=document.querySelectorAll('.bullets .spans span')

    let arrayOfSpan=Array.from(bulletsSpan)

    arrayOfSpan.forEach((span,index)=>{

        if(currentIndex ===index){

            span.className = 'on'
        }
    })
}

function showResults (count) {

    let theResulte;

    if(currentIndex ===count){

        quizArea.remove()
        answersArea.remove()
        submitButton.remove()
        bullets.remove()
        
        if(rightAnswer > count/2 && rightAnswer < count){

            theResulte=`<span class="good">Good</span>,${rightAnswer} From ${count} Is Good`
       
        }else if(rightAnswer === count){

            theResulte=`<span class="perfect">Perfect</span>. All Answer Is Perfect`;
        }else{
            theResulte=`<span class="bad">Bad</span>, ${rightAnswer} From ${count} Is Bad`
        }

        resulesCountainer.innerHTML=theResulte;
        resulesCountainer.style.padding='10px'
        resulesCountainer.style.backgroundColor='white'
        resulesCountainer.style.marginTop='10px'

    }
}

 function countDown (duration,count){

    if(currentIndex < count){

        let minutes ,seconds;

        countDownInterval=setInterval(function () {
            
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes<10 ? `0${minutes}`:minutes;
            seconds = seconds<10 ? `0${seconds}`:seconds;

            countDownElement.innerHTML=`${minutes}:${seconds}`

            if(--duration < 0){
                clearInterval(countDownInterval);

                submitButton.click()
            }

          },1000)
    }
        
}