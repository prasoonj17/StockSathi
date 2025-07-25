import Swal from 'sweetalert2';

/**
 * Universal delete confirmation popup
 * @returns {Promise<boolean>}
 */
const confirmDeletePopup = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You cannot undo this action!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48', // red
    cancelButtonColor: '#6b7280',  // gray
    confirmButtonText: 'Yes, delete it!',
  });

  return result.isConfirmed;
};

export default confirmDeletePopup;
