
<!-- routify:meta reset -->

<div id="container">
    <div id="main">
        <slot></slot>

    </div>
</div>

<style>
    #container{
        display: flex;
        justify-content: center;
    }

    #main{
        flex-direction: column;
        display: flex;
        justify-content: center;
        border: 0px solid black;
        
    }

</style>