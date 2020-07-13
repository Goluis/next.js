import Modal from 'react-modal'
import { useCart, useCheckout } from '@/lib/cart'
import CartItem from './cart-item'
import Button from './button'
import styles from './cart-modal.module.css'

Modal.setAppElement('#__next')

export default function CartModal() {
  const { isOpen, closeCart } = useCart()
  const { checkout, loading, errorMsg, updateItem } = useCheckout()
  const lineItems = checkout?.lineItems.edges ?? []
  const handleSubmit = (e) => {
    e.preventDefault()
    window.open(checkout.webUrl)
  }
  const formatCurrency =
    checkout &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: checkout.subtotalPriceV2.currencyCode,
    })
  const price = formatCurrency?.format(checkout.subtotalPriceV2.amount)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeCart}
      contentLabel="Example Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className="bg-accent-2 px-8 py-4">
        <h3 className="text-2xl">Shopping Cart</h3>
      </div>

      <div className="p-8">
        {lineItems.length ? (
          <form onSubmit={handleSubmit}>
            {lineItems.map(({ node }) => (
              <CartItem
                key={node.variant.id}
                item={node}
                loading={loading}
                onItemUpdate={updateItem}
              />
            ))}

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl">Subtotal</h3>
              <h3 className="text-2xl">{price}</h3>
            </div>
            <p className="text-sm text-left text-accent-5 mb-2">
              Shipping & taxes calculated at checkout
            </p>
            <p className="text-right text-error h-6">{errorMsg}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button
                type="button"
                onClick={closeCart}
                disabled={loading}
                secondary
              >
                Continue Shopping
              </Button>
              <Button type="submit" disabled={loading}>
                Check Out
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-lg">Your cart is currently empty.</p>
            <div className="mt-8">
              <Button
                type="button"
                className="w-full"
                onClick={closeCart}
                disabled={loading}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}