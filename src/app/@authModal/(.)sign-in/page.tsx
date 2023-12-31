import CloseModalButton from '@/components/CloseModalButton';
import ModalWrapper from '@/components/ModalWrapper';
import SignIn from '@/components/SignIn';
import React from 'react';

export default function SignInModal() {
  return (
    <ModalWrapper>
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg z-50">
          <div className="absolute top-4 right-4">
            <CloseModalButton />
          </div>

          <SignIn />
        </div>
      </div>
    </ModalWrapper>
  );
}
