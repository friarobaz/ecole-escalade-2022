<script>

    import { COLORS } from '$utils/colors'
    
    export let color, text, selected, done

    let background, background2, textColor

    $:if(color){
        background = COLORS.filter(x=>x.name==color)[0].background
        background2 = COLORS.filter(x=>x.name==color)[0].background2
        textColor = COLORS.filter(x=>x.name==color)[0].text
    }

</script>

<span class={selected? "container selected" : "container"}>
    <a href="#" role="button"
    class='route'
    style="
    background-image:repeating-linear-gradient({background},{background2 || background}, {background});
    color: {textColor};
    opacity: {done?0.1:1};
    cursor: {done?'default':'pointer'};
    border: 1px solid {background=='white'?'black':background}">
        {text} {#if done}déjà  fait {/if}
    </a>
</span>

<style>
    .route{
        padding: 15px;
        border: none;
        font-weight: bold;
        max-width: 300px;
        min-width: 200px;
    }
    
    .selected a{
        text-decoration:underline;
    }
</style>