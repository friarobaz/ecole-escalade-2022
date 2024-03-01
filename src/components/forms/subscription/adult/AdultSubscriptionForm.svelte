<script>
    import NameFormNoRestriction from '../NameFormNoRestriction.svelte';
    import NameFormWithRestriction from '../NameFormWithRestriction.svelte';
    import DateOfBirthForm from '$components/forms/subscription/DateOfBirthForm.svelte'
    import { subscription } from '$utils/stores'
    import { getAuth } from "firebase/auth"

    let firstName, lastName, tel, accidentTel, dateOfBirth, selectedStudent
    export let pastStudentsOnly = false

    $:email = getAuth().currentUser.email
    $subscription.privateInfo.parents = []
    
    // Persistent data, in case user leaves the page and comes back
    // If the forms are empty, fill inputs with $subscription data
    if(!firstName) firstName = $subscription.publicInfo.firstName
    if(!lastName) lastName = $subscription.publicInfo.lastName
    if(!dateOfBirth) dateOfBirth = $subscription.privateInfo.dateOfBirth
    if(!tel) tel = $subscription.privateInfo.tel
    if(!accidentTel) accidentTel = $subscription.privateInfo.accidentTel
    
    // Sync $subscription store when data in written in form
    $:if(firstName) $subscription.publicInfo.firstName = firstName
    $:if(lastName) $subscription.publicInfo.lastName = lastName
    $:if(dateOfBirth) $subscription.privateInfo.dateOfBirth = dateOfBirth
    $:if(tel) $subscription.privateInfo.tel = tel
    $:if(email) $subscription.privateInfo.email = email
    $:if(accidentTel) $subscription.privateInfo.accidentTel = accidentTel

    $:if(selectedStudent) dateOfBirth = selectedStudent.private.dateOfBirth
    $:if(selectedStudent) tel = selectedStudent.private.tel
    $:if(selectedStudent) accidentTel = selectedStudent.private.accidentTel

</script>

 <section>
    {#if pastStudentsOnly}
        <NameFormWithRestriction bind:firstName bind:lastName bind:selectedStudent  />
    {:else}
        <NameFormNoRestriction bind:firstName bind:lastName  />
    {/if}

    <DateOfBirthForm bind:dateOfBirth/>
    
    <label for="email">Adresse email</label>
    <input type="email" id="email" name="email" placeholder="Adresse email" disabled bind:value={email}>
    

    <label for="phoneNumber">Téléphone</label>
    <input type="tel" id="tel" name="tel" required bind:value={tel}>

    <label for="phoneNumber">Téléphone de la personne à prévenir en cas d'accident</label>
    <input type="tel" id="tel" name="tel" required bind:value={accidentTel}>
</section>