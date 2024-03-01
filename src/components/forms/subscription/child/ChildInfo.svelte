<script>
    import DateOfBirthForm from '$components/forms/subscription/DateOfBirthForm.svelte'
    import {subscription} from '$utils/stores'
    import NameFormNoRestriction from '../NameFormNoRestriction.svelte';
    import NameFormWithRestriction from '../NameFormWithRestriction.svelte';

    export let pastStudentsOnly, selectedStudent

    let firstName, lastName, dateOfBirth

    // Persistent data, in case user leaves the page and comes back
    // If the forms are empty, fill inputs with $subscription data
    if (!firstName)firstName = $subscription.publicInfo.firstName
    if (!lastName)lastName = $subscription.publicInfo.lastName
    if (!dateOfBirth) dateOfBirth = $subscription.privateInfo.dateOfBirth

    // Sync $subscription store when data in written in form
    $:if (firstName) $subscription.publicInfo.firstName = firstName.toLowerCase()
    $:if (lastName) $subscription.publicInfo.lastName = lastName.toLowerCase()
    $:if (dateOfBirth) $subscription.privateInfo.dateOfBirth = dateOfBirth

    $:if(selectedStudent) dateOfBirth = selectedStudent.private.dateOfBirth

</script>

<section>
    <h5>Enfant</h5>
    
    {#if pastStudentsOnly}
       <!--  <NameFormWithRestriction bind:firstName bind:lastName  /> -->
        <NameFormWithRestriction bind:firstName bind:lastName  bind:selectedStudent/>
    {:else}
        <NameFormNoRestriction bind:firstName bind:lastName  />
    {/if}
    <DateOfBirthForm bind:dateOfBirth/>
    
</section>


