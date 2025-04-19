import { gql } from '@apollo/client';

// GraphQL query to fetch all products with variants and inventory information
export const GET_PRODUCTS_WITH_VARIANTS_AND_INVENTORY = gql`
  query GetProductsWithVariantsAndInventory($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          descriptionHtml
          productType
          tags
          createdAt
          updatedAt
          vendor
          options {
            id
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            id
            url
            altText
            width
            height
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                }
                quantityAvailable
                requiresShipping
                weight
                weightUnit
              }
            }
          }
          totalInventory
          availableForSale
          metafields(identifiers: [
            {namespace: "custom", key: "specifications"},
            {namespace: "custom", key: "details"}
          ]) {
            id
            namespace
            key
            value
          }
        }
      }
    }
  }
`; 