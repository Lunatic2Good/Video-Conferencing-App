'use client'

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
    const call = useCall();
    const router = useRouter();

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    // const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;
    const isMeetingOwner = localParticipant && call?.isCreatedByMe;

    if(!isMeetingOwner) return null;

  return (
    <Button onClick={async () => {
      await call.endCall();
      router.push('/');
    }} className='bg-red-500'>
      End call for everyone
    </Button>
  )
}

export default EndCallButton
