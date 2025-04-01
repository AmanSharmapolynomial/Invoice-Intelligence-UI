import { useGetVendorPotentialDuplicateBranches } from '@/components/vendor/potentialDuplicates/api';
import React from 'react'
import { useParams } from 'react-router-dom'

const CombineDuplicateBranchFindings = () => {
    const {vendor_id}=useParams();
    const {data,isPending}=useGetVendorPotentialDuplicateBranches(vendor_id)
  return (
    <div>CombineDuplicateBranchFindings</div>
  )
}

export default CombineDuplicateBranchFindings