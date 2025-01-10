import { IconSearch } from '@tabler/icons-react';
import { Burger, Group, Combobox, useCombobox, InputBase } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import classes from './Topbar.module.css';
import PortPolicyLogo from '../../assets/port-policy-forge-logo.svg'

interface TopbarProps {
    onClusterSelect: () => void;
}

const clusters = ['small', 'medium', 'large'];

export function Topbar({ onClusterSelect }: TopbarProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const shouldFilterOptions = clusters.every((item) => item !== search);
    const filteredOptions = shouldFilterOptions
        ? clusters.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
        : clusters;

    const options = filteredOptions.map((cluster) => (
        <Combobox.Option value={cluster} key={cluster}>
            {cluster}
        </Combobox.Option>
    ));

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <img src={PortPolicyLogo} height={60} alt="Port Policy Logo" />
                </Group>

                <Group ml={40}>
                    <Combobox
                        store={combobox}
                        onOptionSubmit={(val) => {
                            setSelectedCluster(val);
                            setSearch(val);
                            combobox.closeDropdown();
                            onClusterSelect();
                        }}
                    >
                        <Combobox.Target>
                            <InputBase
                                rightSection={<Combobox.Chevron />}
                                rightSectionPointerEvents="none"
                                onClick={() => combobox.openDropdown()}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => {
                                    combobox.closeDropdown();
                                    setSearch(selectedCluster || '');
                                }}
                                placeholder="Select Cluster"
                                value={search}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                            />
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>
                                {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </Group>
            </div>
        </header>
    );
}