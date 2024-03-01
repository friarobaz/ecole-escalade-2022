<script>
    import { subscription } from '$utils/stores'
    import { getAuth } from "firebase/auth"
    import NameFormNoRestriction from '../NameFormNoRestriction.svelte'
    export let nb, parent

    let firstName, lastName, role, email, tel

    if(parent){
        firstName = parent.firstName
        lastName = parent.lastName
        role = parent.role
        email = parent.email
        tel = parent.tel
    }

    // Persistent data, in case user leaves the page and comes back
    // If the forms are empty, fill inputs with $subscription data
    if(!firstName) firstName = $subscription.privateInfo.parents[nb-1].firstName
    if(!lastName) lastName = $subscription.privateInfo.parents[nb-1].lastName
    if(!role) role = $subscription.privateInfo.parents[nb-1].role
    if(!email) email = $subscription.privateInfo.parents[nb-1].email
    if(!tel) tel = $subscription.privateInfo.parents[nb-1].tel
        
        // First parent has user email 
    if (nb===1) email = getAuth().currentUser.email
    
    
    // Sync $subscription store when data in written in form
    $:if(firstName) $subscription.privateInfo.parents[nb-1].firstName = firstName
    $:if(lastName) $subscription.privateInfo.parents[nb-1].lastName = lastName
    $:if(role) $subscription.privateInfo.parents[nb-1].role = role
    $:if(email) $subscription.privateInfo.parents[nb-1].email = email
    $:if(tel) $subscription.privateInfo.parents[nb-1].tel = tel

    //Default roles
    if(!role){
        //First parent is mother
        if(nb===1) role = 'mother'
        //Second parent is father
        if(nb===2) role = 'father'
    }

</script>

 <section>
    <h5>Parent {nb}</h5>
    
    <NameFormNoRestriction bind:firstName bind:lastName/>
     
    <label for="relationship">Affiliation</label>
    <select id="relationship" required bind:value={role}>
        <option value="mother">Mère</option>
        <option value="father">Père</option>
        <option value="other">Autre</option>
    </select>
    
    <label for="email">Adresse email</label>
    <input type="email" id="email" name="email" placeholder="Adresse email" disabled={nb==1} required bind:value={email} aria-invalid={nb==1?'false':null}>
    

    <label for="phoneNumber">Téléphone</label>
    <input type="tel" id="tel" name="tel" required bind:value={tel}>
</section>