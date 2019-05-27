let arr = ["djfsj<b>wfasfa</b>sdgsdgs<b>sgfszdg</b>fsfsd<b>fhdfhdhf", "dgsdgsd</b>dgsdgsdg<b>fsDgdsg</b>"];
for (let i =0; i < arr.length; i++){
    let t = arr[i].match(/(<\/?b>)/ig);
    if(t){
        if(t[t.length -1] === "<b>"){
            arr[i] = `${arr[i]}</b>`;
            arr[i+1] = `<b>${arr[i+1]}`;

        }
    }
    console.log(arr[i]);

}