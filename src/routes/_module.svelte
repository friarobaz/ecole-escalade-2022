<script>
    import { firebaseApp } from '$utils/firebase/firebase' //important, do not remove
    export let context //just to hide warning in console
    import { getAuth, onAuthStateChanged } from "firebase/auth"
    import { getSeason } from '$firestore/season'
    import {currentDay, currentSeason, loggedin, subscription, admin, error, fatal, students, mod} from '$utils/stores'
    import Back from '$components/htmlElements/Back.svelte'
    import Logout from '$components/htmlElements/Logout.svelte'
    import {isActive} from '@roxi/routify'
    import { seasons } from '$utils/seasons'
    import ErrorMessage from '$components/htmlElements/ErrorMessage.svelte'
    import { subscriptionReset } from '$utils/subscriptionReset'
    import { BError } from "berror"
    import ErrorModal from '$components/modals/ErrorModal.svelte'
    import { collection, query, where, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { printName } from '$utils/printName'
    import { _getDoc } from '$firestore/basics'

    

    $admin = false
    let verified = false
    let selectedSeason = 'current'

    //$:console.log($students)
    //$:console.log($subscription)

    $:if ($currentSeason) {
        //Reset subscription because season has changed
        $subscription = subscriptionReset($currentSeason)
        $currentDay = $currentSeason.days[0]

        //Get students from selected season
        const q = query(collection(db, "students"), where(`seasons.${$currentSeason.name}.status`, ">", ""))

        const unsubscribe = onSnapshot(q, (snapshot) => {

        const studentsArray = []
        snapshot.forEach((doc) => {
            studentsArray.push(doc)
        })
        $students = studentsArray
        },(err) => {
            console.log(err)
            $error = err
            $fatal=true
        })
    }
    
    let userStoreUpToDate = false

    onAuthStateChanged(getAuth(), (usr)=>{
        userStoreUpToDate = false
      if(usr){
        $loggedin = true
        verified = usr.emailVerified
        usr.getIdTokenResult().then(res => {
            //console.log(res.claims)
          $admin = !!res.claims.admin
          $mod = !!res.claims.mod
        
          //TEST
          //$admin = true
          userStoreUpToDate = true
        })
      }else{
        $loggedin = false
        $admin = false
        $mod = false
        verified = false
        userStoreUpToDate = true
      }
	  })

    $: promise = getSeason(selectedSeason).then(season=>{
        $currentSeason = season
        
    }).catch(err=>{
        const e = new BError("routes/_module.svelte => Could not get season", err)
        e.log()
        throw e
        $error = e
        $fatal = true
    })
</script>

<body>
    
{#if !$error}
    <div class=wrapper>
        <div class="login">
            <small>
                {#if $loggedin && getAuth().currentUser}
                    <div>
                        <span>👤 </span>
                        {getAuth().currentUser.email}
                        {#if $admin}
                            (admin)
                        {/if}
                        {#if $mod}
                            (mod)
                        {/if}
                    </div>
                    <Logout tiny={true} />
                {:else}
                    &nbsp;<a href="/prive">Se connecter</a>
                {/if}
            </small>
        </div>

        <div class='logo'>
            <a href="https://caf-faverges.ffcam.fr/index.php?alias=ecole-d-escalade&_lang=FR" target="_new">
                <img src="https://www.ffcam.fr/csx/scripts/resizer.php?filename=STADATA_FFCAM%2Fimg1%2F22%2F55%2F52qnarty0o5p&mime=image%252Fpng&originalname=Logo+FFCAM_couleur-.png&geometry=1024x%3E&t=.jpg" alt="FFCAM">
            </a>
        </div>
       
        <div class="season">
            <small>
                {#if $mod}
                    <select id="season" name="season" bind:value={selectedSeason}>
                        <option value={'last'}>{seasons().last}</option>  
                        <option value={'current'}>{seasons().current}</option>  
                        <option value={'next'}>{seasons().next}</option>
                        <!-- removed benevol season, not used ? 08/12/23 -->
                       <!--  <option value={'benevoles'}>Bénévoles</option>   -->
                    </select>
                {:else if $currentSeason}
                    {$currentSeason.name}&nbsp;
                {/if}
            </small>
        </div>
    </div>
        <main class='container'>
            {#await promise}
                <p aria-busy="true">
                    Merci de patienter...
                </p>
            {:then season}
                {#if userStoreUpToDate}
                        <slot></slot>
                    <footer>
                        {#if !$isActive('/')}
                        <div>
                            <Back path='/' msg='Accueil'/>
                        </div>
                        {/if}
                    </footer>
                {:else} 
                    <p aria-busy="true">Waiting for user store update</p>
                {/if}
            {:catch err}
                <ErrorMessage error="Cette saison n'existe pas encore."/>
            {/await}
        </main>
    {:else}
        <ErrorModal />
       <ErrorMessage error={$error}/>
    {/if}
    <div class='help'>
        <small style="color:grey"> Besoin d'aide ?
            <a href="mailto:julesmarchand74@gmail.com" target="_new"> Cliquez ici pour contacter Jules</a>
        </small>
    </div>
</body>

<style>
    .wrapper{
        top:0;
        display: flex;
        justify-content: space-between;
    }
    select{
        margin: 0;
        
    }
    .logo img{
        max-height: 50px;
        margin-top: 5px;
    }
    footer{
        display:flex;
        flex-wrap: wrap;
        margin-top: 100px;
    }

    footer div{
        flex: 1;
        max-width: 200px;
        margin-right: 10px;
    }

    span{
        margin: 5px;
    }

    .help{
        width:100%;
        display: flex;
        justify-content: center;
    }

</style>