export const truncateAddress = (address: string,
                                left = 6,
                                right = 4,
                                separator = "...") => [address?.substring(0, left), separator, address?.substring(address.length-right)].join("");