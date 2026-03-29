import WalletForm from './components/WalletForm';
import WalletList from './components/WalletList';
import CurrentWallet from './components/CurrentWallet';
import WalletButton from './components/WalletButton';
import { useCurrentWallet } from '@/hooks/wallet/UseCurrentWallet';
import { useGetUserWallets } from '@/hooks/wallet/UseGetUserWallets';

const Wallet = () => {
  const { currentWalletId, selectWallet } = useCurrentWallet();
  const { data: wallets = [] } = useGetUserWallets();
  const currentWallet = wallets.find((w) => w.id === currentWalletId) ?? null;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Wallet</p>
        <WalletButton />
      </div>
      <div className="w-full h-full flex gap-4">
        <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg overflow-y-auto">
          <WalletForm />
          <hr />
          <CurrentWallet
            currentWallet={currentWallet}
            wallets={wallets}
            onSelectWallet={selectWallet}
          />
        </div>
        <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">List of Wallets</p>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <WalletList
              currentWalletId={currentWalletId}
              onSelectWallet={selectWallet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
